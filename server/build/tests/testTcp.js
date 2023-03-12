"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
var buffer = Buffer.from("");
const client = net_1.default.createConnection({ port: 3001, host: '192.168.1.76', allowHalfOpen: true }, () => {
    console.log('Connected to server');
    // Send a message to the server
    client.write('Hello, server!');
});
client.on('data', (data) => {
    console.log(client.writableLength);
    if (data.byteLength > client.writableHighWaterMark) {
    }
    console.log('Received data of size: ' + data.byteLength);
    // if(data.toString()[data.length - 1] == '}') {
    //     let map:IOccupancyGrid = JSON.parse(data.toString());
    //     console.log(`Received map of ${map.width} width and ${map.height} height`)
    // }
});
client.on('drain', () => {
    console.log("DRAIN EVENT");
});
client.on('end', () => {
    console.log('Disconnected from server');
});
