import { RemoteInfo, Socket } from "dgram";
import { IOccupancyGrid } from "../models/OccupancyGrid";
import { IWifiRun, WifiRun } from "../models/WifiRun";
import { ISocketServerDelegate } from "../servers/SocketServer";
import { ITcpSocket } from "../servers/TCPServer";
import net from 'net'
import { CreateMockMap } from "../utils/mock";
import { IsJSON } from "../utils/util";

const USE_MOCK = true;

class TcpMapDelegate implements ITcpSocket {
    port: number = 3001;
    map?: IOccupancyGrid;
    current_run?: IWifiRun & any = undefined;
    clients: net.Socket[] = []

    constructor() {
        if(USE_MOCK)
            this.map = CreateMockMap(400);

        setInterval(() => {
            if(this.map)
                this.publishMap();
        }, 5000)
    }

    onMessage(data: Buffer, rinfo: RemoteInfo) {
        if(IsJSON(data.toString())) {
            if(!this.handleInitializeRun(data)) {
                this.map = JSON.parse(data.toString());
            }
        }
    }

    onClose(client: net.Socket) {
        this.clients = this.clients.filter(c => c !== client);
    }

    onConnect(socket: net.Socket) {
        this.clients.push(socket);
    }

    onDrain(socket: net.Socket) {
        socket.end();
    }
    
    private handleInitializeRun(msg: any): boolean {
        if(!msg["runId"])
            return false;
        
        console.log(`Connected to a new run ${msg["runId"]}`)

        this.current_run = WifiRun.find({ name: msg["runId"]});
        return true;
    }

    private publishMap(): void {
        console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`)

        for(let client of this.clients) {
            console.log(client.writableLength)
            let result = client.write(JSON.stringify(this.map), (err) => {
                if(err) {
                    console.log(err)
                } else {
                }
            });
            console.log("Write result: " + result)
        }
    }
}

export default TcpMapDelegate;