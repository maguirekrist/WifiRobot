import { RemoteInfo, Socket } from "dgram";
import { IOccupancyGrid } from "../models/OccupancyGrid";
import { IWifiRun, WifiRun } from "../models/WifiRun";
import { ISocketServerDelegate } from "../servers/UDPServer";
import { ITcpSocket } from "../servers/TCPServer";
import net from 'net'
import { CreateMockMap } from "../utils/mock";
import { IsJSON } from "../utils/util";
import NetworkDelegate from "./AbstractNetworkDelegate";

class TcpMapDelegate extends NetworkDelegate {
    map?: IOccupancyGrid;
    current_run?: IWifiRun & any = undefined;

    constructor() {
        super(3001);
        if(process.env.USE_MOCK == 'true')
            this.map = CreateMockMap(400);

        setInterval(() => {
            if(this.map)
                this.publishMap();
        }, 5000)
    }

    override onMessage(msg: Buffer, rinfo: RemoteInfo) {
        let msgStr = msg.toString();
        let msgJson = JSON.parse(msgStr);
        if(!this.handleInitializeRun(msgJson)) {
            // console.log(msgJson.data.filter((e: number) => e < 10 && e >= 0))
            this.map = this.remapGrid(msgJson as IOccupancyGrid);
            console.log(`Received map of ${this.map?.width} width and ${this.map?.height}: is correct? ${this.map?.height * this.map?.width == this.map?.data.length}`)
            // console.log(this.map.data.filter(e => e != 0 && e != 255))
        }
    }
    
    private handleInitializeRun(msg: any): boolean {
        if(!msg["runId"])
            return false;
        
        console.log(`Connected to a new run ${msg["runId"]} on Map`)

        this.current_run = WifiRun.find({ name: msg["runId"]});
        return true;
    }

    private remapGrid(grid: IOccupancyGrid) {
        grid.data = grid.data.map(e => {
            if(e < 0) {
                return -1;
            } else {
                var frac = e / 100;
                return Math.round(125 * frac);
            }
        })
        return grid;
    }

    private publishMap(): void {
        // console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`)
        super.publish(this.map!);
    }
}

export default TcpMapDelegate;