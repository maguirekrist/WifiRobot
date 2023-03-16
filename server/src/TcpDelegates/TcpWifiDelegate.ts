import { RemoteInfo } from "dgram";
import { WifiCollection } from "../models/WifiCollection";
import { IWifiRun, WifiRun } from "../models/WifiRun";
import { ITcpSocket } from "../servers/TCPServer";
import net from 'net'
import NetworkDelegate from "./AbstractNetworkDelegate";
import { CreateMockWifiRun } from "../utils/mock";

class TcpWifiDelegate extends NetworkDelegate {
    current_run?: IWifiRun & any = undefined;

    constructor() {
        super(3002);

        if(process.env.USE_MOCK == 'true')
            this.current_run = CreateMockWifiRun();

        setInterval(() => {
            if(this.current_run && this.current_run.scans[0])
                this.publishCollection();
        }, 5000)
    }

    override onMessage (msg: Buffer, rinfo: RemoteInfo): void {
        let msgStr = msg.toString();
        let msgJson = JSON.parse(msgStr);
        if(!this.handleInitializeRun(msgJson)) {
            let collection = new WifiCollection(msgJson)
            this.current_run.scans.push(collection);
            this.current_run.save();
        };
    };

    private handleInitializeRun(msg: any): boolean {
        if(!msg["runId"])
            return false;
        
        console.log(`Connected to a new run ${msg["runId"]}`)

        this.current_run = new WifiRun({
            name: msg["runId"]
        });
        this.current_run.save();
        return true;
    }

    private publishCollection(): void {
        console.log(`Publishing wifi to ${this.clients.length} clients, wifi run size: ${Buffer.from(JSON.stringify(this.current_run.scans[0])).byteLength}`)

        //console.log(this.current_run.scans[0])

        for(let client of this.clients) {
            console.log(client.writableLength)
            if(this.current_run.scans[0]) {
                client.write(JSON.stringify(this.current_run.scans[0]), (err) => {
                    if(err) {
                        console.log(err)
                    } else {
                    }
                });
            }
        }
    }

}

export default TcpWifiDelegate;