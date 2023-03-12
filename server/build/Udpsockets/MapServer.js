"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WifiRun_1 = require("../models/WifiRun");
const mock_1 = require("../utils/mock");
const USE_MOCK = true;
class MapServer {
    constructor() {
        this.port = 3001;
        this.current_run = undefined;
        this.subscribers = new Map();
        this.isChunking = false;
        this.chunkData = Buffer.from("");
    }
    onMessage(msg, rinfo) {
        let msgStr = msg.toString();
        if (msgStr == "subscribe") {
            console.log(`A new connection subscribed! ${rinfo.address}:${rinfo.port}`);
            this.subscribers.set(`${rinfo.address}:${rinfo.port}`, rinfo);
        }
        else {
            if (msgStr == "chunk_begin") {
                this.chunkData = Buffer.from("");
                console.log("Chunking Begin");
                this.isChunking = true;
                return;
            }
            if (msgStr == "chunk_end") {
                console.log("Chunking End");
                this.isChunking = false;
                this.map = JSON.parse(this.chunkData.toString());
                return;
            }
            if (this.isChunking) {
                console.log("Got Chunk Data");
                this.chunkData = Buffer.concat([this.chunkData, msg]);
            }
            else {
                let msgJson = JSON.parse(msgStr);
                this.handleInitializeRun(msgJson);
            }
        }
    }
    onListening(server) {
        this.server = server;
        if (USE_MOCK)
            this.map = (0, mock_1.CreateMockMap)(384);
        setInterval(() => {
            //console.log("Publishing map to subscribers...")
            if (this.map)
                this.publishMap();
        }, 7000);
    }
    handleInitializeRun(msg) {
        if (!msg["runId"])
            return false;
        console.log(`Connected to a new run ${msg["runId"]}`);
        this.current_run = WifiRun_1.WifiRun.find({ name: msg["runId"] });
        return true;
    }
    publishMap() {
        //creates a chunked stream
        const chunkData = (data) => {
            const CHUNK_SIZE = 63 * 1024;
            let chunks = [];
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                chunks.push(data.slice(i, i + CHUNK_SIZE));
            }
            return chunks;
        };
        console.log(`Publishing map of size`);
        let strMap = JSON.stringify(this.map);
        let chunks = chunkData(strMap);
        console.log(`Number of chunks: ${chunks.length}`);
        console.log(`Size of first chunk: ${chunks[0].length}`);
        console.log(`Size of last chunk: ${chunks[chunks.length - 1].length}`);
        for (let i = 0; i < chunks.length; i++) {
            setTimeout(() => {
                var _a;
                let chunk = chunks[i];
                for (let [key, ele] of this.subscribers) {
                    (_a = this.server) === null || _a === void 0 ? void 0 : _a.send(chunk.toString(), 0, chunk.length, ele.port, ele.address, (err) => {
                        if (err) {
                            //couldn't send, so we need to remove it from the list of subscribers
                            console.log("ERRORED OCCURED");
                            this.subscribers.delete(key);
                            console.error(err);
                        }
                        else {
                            console.log(`Successfully sent ${chunk.length} bytes`);
                        }
                    });
                }
            }, 10 * i);
        }
        console.log("Publish map completed");
    }
}
exports.default = MapServer;
