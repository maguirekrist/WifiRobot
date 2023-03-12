import { RemoteInfo } from "dgram";
import { Model, Types, Document } from "mongoose";
import { WifiCollection } from "../models/WifiCollection";
import { IWifiRun, WifiRun } from "../models/WifiRun";
import { ISocketServerDelegate } from "../servers/SocketServer";

class WifiServer implements ISocketServerDelegate {
    port: number = 3002;
    current_run?: IWifiRun & any = undefined;

    onError?: ((err: Error) => void) | undefined;
    onClose?: (() => void) | undefined;
    onMessage (msg: Buffer, rinfo: RemoteInfo): void {
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
}

export default WifiServer;