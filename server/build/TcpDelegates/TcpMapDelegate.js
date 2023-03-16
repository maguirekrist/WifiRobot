"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WifiRun_1 = require("../models/WifiRun");
const mock_1 = require("../utils/mock");
const util_1 = require("../utils/util");
const AbstractNetworkDelegate_1 = __importDefault(require("./AbstractNetworkDelegate"));
class TcpMapDelegate extends AbstractNetworkDelegate_1.default {
    constructor() {
        super(3001);
        this.current_run = undefined;
        if (process.env.USE_MOCK == 'true')
            this.map = (0, mock_1.CreateMockMap)(400);
        setInterval(() => {
            if (this.map)
                this.publishMap();
        }, 5000);
    }
    onMessage(data, rinfo) {
        if ((0, util_1.IsJSON)(data.toString())) {
            if (!this.handleInitializeRun(data)) {
                this.map = JSON.parse(data.toString());
            }
        }
    }
    handleInitializeRun(msg) {
        if (!msg["runId"])
            return false;
        console.log(`Connected to a new run ${msg["runId"]}`);
        this.current_run = WifiRun_1.WifiRun.find({ name: msg["runId"] });
        return true;
    }
    publishMap() {
        console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`);
        for (let client of this.clients) {
            console.log(client.writableLength);
            client.write(JSON.stringify(this.map), (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                }
            });
        }
    }
}
exports.default = TcpMapDelegate;
