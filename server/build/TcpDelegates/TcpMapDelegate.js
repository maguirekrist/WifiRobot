"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WifiRun_1 = require("../models/WifiRun");
const mock_1 = require("../utils/mock");
const util_1 = require("../utils/util");
const USE_MOCK = true;
class TcpMapDelegate {
    constructor() {
        this.port = 3001;
        this.current_run = undefined;
        this.clients = [];
        if (USE_MOCK)
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
    onClose(client) {
        this.clients = this.clients.filter(c => c !== client);
    }
    onConnect(socket) {
        this.clients.push(socket);
    }
    onDrain(socket) {
        socket.end();
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
            let result = client.write(JSON.stringify(this.map), (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                }
            });
            console.log("Write result: " + result);
        }
    }
}
exports.default = TcpMapDelegate;
