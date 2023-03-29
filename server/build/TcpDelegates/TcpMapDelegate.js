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
            this.map = (0, mock_1.CreateMockMap)(400);
        // setInterval(() => {
        //     if(this.map)
        //         this.publishMap();
        // }, 5000)
    }
    onMessage(msg, rinfo) {
        var _a, _b, _c, _d, _e;
        let msgStr = msg.toString();
        let msgJson = JSON.parse(msgStr);
        if (!this.handleInitializeRun(msgJson)) {
            // console.log(msgJson.data.filter((e: number) => e < 10 && e >= 0))
            this.map = this.remapGrid(msgJson);
            console.log(`Received map of ${(_a = this.map) === null || _a === void 0 ? void 0 : _a.width} width and ${(_b = this.map) === null || _b === void 0 ? void 0 : _b.height}: is correct? ${((_c = this.map) === null || _c === void 0 ? void 0 : _c.height) * ((_d = this.map) === null || _d === void 0 ? void 0 : _d.width) == ((_e = this.map) === null || _e === void 0 ? void 0 : _e.data.length)}`);
            // console.log(this.map.data.filter(e => e != 0 && e != 255))
            this.publishMap();
        }
    }
    onConnect(socket) {
        super.onConnect(socket);
        this.publishMap();
    }
    handleInitializeRun(msg) {
        if (!msg["runId"])
            return false;
        console.log(`Connected to a new run ${msg["runId"]} on Map`);
        this.current_run = WifiRun_1.WifiRun.find({ name: msg["runId"] });
        return true;
    }
    remapGrid(grid) {
        grid.data = grid.data.map(e => {
            if (e < 0) {
                return -1;
            }
            else {
                var frac = e / 100;
                return Math.round(125 * frac);
            }
        });
        return grid;
    }
    publishMap() {
        // console.log(`Publishing map to ${this.clients.length} clients, map size: ${Buffer.from(JSON.stringify(this.map)).byteLength}`)
        if (this.map)
            super.publish(this.map);
    }
}
exports.default = TcpMapDelegate;
