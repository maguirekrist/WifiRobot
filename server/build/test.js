"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_dgram_1 = __importDefault(require("node:dgram"));
const client = node_dgram_1.default.createSocket({ type: 'udp4' });
client.on('message', function (msg, info) {
    console.log('Data received from server : ' + msg.toString());
    console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);
});
var data = Buffer.from('Hi I m the client 1');
client.send(data, 3001, 'localhost', function (error) {
    if (error) {
        console.log(error);
        client.close();
    }
    else {
        console.log('Data is sent !');
    }
});
