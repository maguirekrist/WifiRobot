"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WifiCollection_1 = require("../models/WifiCollection");
const WifiRun_1 = require("../models/WifiRun");
class WifiServer {
    constructor() {
        this.port = 3002;
        this.current_run = undefined;
    }
    onMessage(msg, rinfo) {
        let msgStr = msg.toString();
        let msgJson = JSON.parse(msgStr);
        if (!this.handleInitializeRun(msgJson)) {
            let collection = new WifiCollection_1.WifiCollection(msgJson);
            this.current_run.scans.push(collection);
            this.current_run.save();
        }
        ;
    }
    ;
    handleInitializeRun(msg) {
        if (!msg["runId"])
            return false;
        console.log(`Connected to a new run ${msg["runId"]}`);
        this.current_run = new WifiRun_1.WifiRun({
            name: msg["runId"]
        });
        this.current_run.save();
        return true;
    }
}
exports.default = WifiServer;
