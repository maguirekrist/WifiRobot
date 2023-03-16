"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WifiCollection_1 = require("../models/WifiCollection");
const WifiRun_1 = require("../models/WifiRun");
const AbstractNetworkDelegate_1 = __importDefault(require("./AbstractNetworkDelegate"));
const mock_1 = require("../utils/mock");
class TcpWifiDelegate extends AbstractNetworkDelegate_1.default {
    constructor() {
        super(3002);
        this.current_run = undefined;
        if (process.env.USE_MOCK == 'true')
            this.current_run = (0, mock_1.CreateMockWifiRun)();
        setInterval(() => {
            if (this.current_run && this.current_run.scans[0])
                this.publishCollection();
        }, 5000);
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
    publishCollection() {
        console.log(`Publishing wifi to ${this.clients.length} clients, wifi run size: ${Buffer.from(JSON.stringify(this.current_run.scans[0])).byteLength}`);
        //console.log(this.current_run.scans[0])
        for (let client of this.clients) {
            console.log(client.writableLength);
            if (this.current_run.scans[0]) {
                client.write(JSON.stringify(this.current_run.scans[0]), (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                    }
                });
            }
        }
    }
}
exports.default = TcpWifiDelegate;
