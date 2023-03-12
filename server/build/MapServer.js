"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
class MapServer {
    constructor() {
        this.server = node_dgram_1.default.createSocket('udp4');
        this.server.bind(3001, 'localhost');
        this.server.on('error', (err) => {
            console.log(`server error: \n ${err.stack}`);
            this.server.close();
        });
        this.server.on('close', () => {
            console.log("UDP server has been closed");
        });
        this.server.on('message', (msg, rinfo) => {
            console.log(`Server got a cool message: ${msg} `);
        });
        this.server.on('listening', () => {
            const address = this.server.address();
            console.log(`Server listening on ${address.address}:${address.port}`);
        });
    }
}
exports.default = MapServer;
