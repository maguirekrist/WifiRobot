"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCPServer = void 0;
const net_1 = __importDefault(require("net"));
class TCPServer {
    constructor(delegate) {
        this.senders = new Map();
        this.buffer = Buffer.from("");
        this.delegate = delegate;
        //The call back on createServer is actually the connection event
        this.server = net_1.default.createServer((socket) => {
            console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected`);
            delegate.onConnect(socket);
            socket.on('data', (data) => {
                this.buffer = Buffer.concat([this.buffer, data]);
                if (data.byteLength != parseInt(process.env.MTU) && this.buffer.byteLength != 0) {
                    this.senders.set(socket, 1);
                    delegate.onMessage(this.buffer, { address: socket.remoteAddress, family: "IPv4", port: socket.remotePort, size: socket.readableHighWaterMark });
                    this.buffer = Buffer.from("");
                }
            });
            socket.on('end', () => {
                var _a;
                (_a = delegate.onClose) === null || _a === void 0 ? void 0 : _a.call(delegate, socket);
                console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
            });
            socket.on('timeout', () => {
                console.log("TIMEOUT EVENT");
            });
            socket.on('drain', () => {
                var _a;
                (_a = delegate.onDrain) === null || _a === void 0 ? void 0 : _a.call(delegate, socket);
            });
            socket.on('error', () => {
                var _a;
                (_a = delegate.onError) === null || _a === void 0 ? void 0 : _a.call(delegate, socket);
            });
        });
    }
    listen() {
        this.server.listen(this.delegate.port, process.env.HOST_ADDRESS, () => {
            console.log("Server listening on port " + this.delegate.port);
        });
    }
}
exports.TCPServer = TCPServer;
