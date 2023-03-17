"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WifiRun_1 = require("../models/WifiRun");
const mock_1 = require("../utils/mock");
const AbstractNetworkDelegate_1 = __importDefault(require("./AbstractNetworkDelegate"));
class TcpMapDelegate extends AbstractNetworkDelegate_1.default {
    constructor() {
        super(3001);
        this.current_run = undefined;
        if (process.env.USE_MOCK == 'true')
            this.map = (0, mock_1.CreateMockMap)(25);
        setInterval(() => {
            if (this.map)
                this.publishMap();
        }, 5000);
    }
    onMessage(msg, rinfo) {
        var _a, _b;
        let msgStr = msg.toString();
        let msgJson = JSON.parse(msgStr);
        if (!this.handleInitializeRun(msgJson)) {
            this.map = msgJson;
            console.log((_a = this.map) === null || _a === void 0 ? void 0 : _a.height);
            console.log((_b = this.map) === null || _b === void 0 ? void 0 : _b.width);
        }
    }
    handleInitializeRun(msg) {
        if (!msg["runId"])
            return false;
        console.log(`Connected to a new run ${msg["runId"]} on Map`);
        this.current_run = WifiRun_1.WifiRun.find({ name: msg["runId"] });
        return true;
    }
    publishMap() {
        // console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`)
        super.publish(this.map);
    }
}
exports.default = TcpMapDelegate;
