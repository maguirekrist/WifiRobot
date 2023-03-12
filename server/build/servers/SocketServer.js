"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketServer = void 0;
const node_dgram_1 = __importDefault(require("node:dgram"));
class SocketServer {
    constructor(delegate) {
        this.server = node_dgram_1.default.createSocket('udp4');
        this.port = delegate.port;
        this.server.on('error', (err) => {
            var _a;
            (_a = delegate.onError) === null || _a === void 0 ? void 0 : _a.call(delegate, err);
            this.server.close();
        });
        this.server.on('close', () => {
            var _a;
            (_a = delegate.onClose) === null || _a === void 0 ? void 0 : _a.call(delegate);
            console.log("UDP server has been closed");
        });
        this.server.on('message', (msg, rinfo) => {
            delegate.onMessage(msg, rinfo);
        });
        this.server.on('listening', () => {
            var _a;
            (_a = delegate.onListening) === null || _a === void 0 ? void 0 : _a.call(delegate, this.server);
            const address = this.server.address();
            console.log(`Socket listening on ${address.address}:${address.port}`);
        });
        this.server.on('connect', () => {
            console.log("Somethign has connected to the server!");
        });
    }
    listen() {
        this.server.bind(this.port, '192.168.1.76');
    }
}
exports.SocketServer = SocketServer;
