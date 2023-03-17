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
            this.map = msgJson;
            console.log(this.map?.height)
            console.log(this.map?.width)
        }
    }
    
    private handleInitializeRun(msg: any): boolean {
        if(!msg["runId"])
            return false;
        
        console.log(`Connected to a new run ${msg["runId"]} on Map`)

        this.current_run = WifiRun.find({ name: msg["runId"]});
        return true;
    }

    private publishMap(): void {
        // console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`)
        super.publish(this.map!);
    }
}

export default TcpMapDelegate;