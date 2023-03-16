import { RemoteInfo } from "dgram";
import { IOccupancyGrid } from "../models/OccupancyGrid";
import { IWifiRun, WifiRun } from "../models/WifiRun";
import { ISocketServerDelegate } from "../servers/UDPServer";
import dgram from 'node:dgram'
import { Readable } from "stream";
import { json } from "stream/consumers";
import { CreateMockMap } from "../utils/mock";

const USE_MOCK = true;

class MapServer implements ISocketServerDelegate {
    port: number = 3001;
    current_run?: IWifiRun & any = undefined;
    map?: IOccupancyGrid;
    subscribers: Map<string, RemoteInfo> = new Map();
    server?: dgram.Socket;
    isChunking: boolean = false; 
    chunkData: Buffer = Buffer.from("");

    onError?: ((err: Error) => void) | undefined;
    onClose?: (() => void) | undefined;
    onMessage(msg: Buffer, rinfo: RemoteInfo): void {
        let msgStr = msg.toString();
        if(msgStr == "subscribe")
        {
            console.log(`A new connection subscribed! ${rinfo.address}:${rinfo.port}`)
            this.subscribers.set(`${rinfo.address}:${rinfo.port}`, rinfo);
        } else {
            if(msgStr == "chunk_begin") {
                this.chunkData = Buffer.from("");
                console.log("Chunking Begin")
                this.isChunking = true;
                return;
            }

            if(msgStr == "chunk_end") {
                console.log("Chunking End")
                this.isChunking = false;
                this.map = JSON.parse(this.chunkData.toString());
                return;
            }

            if(this.isChunking) {
                console.log("Got Chunk Data")
                this.chunkData = Buffer.concat([this.chunkData, msg]);
            } else {
                let msgJson = JSON.parse(msgStr);
                this.handleInitializeRun(msgJson);
            }
        }
    }

    onListening(server: dgram.Socket) {
        this.server = server;

        if(USE_MOCK)
            this.map = CreateMockMap(384);

        setInterval(() => {
            //console.log("Publishing map to subscribers...")
            if(this.map)
                this.publishMap();
        }, 7000)
    }
    
    private handleInitializeRun(msg: any): boolean {
        if(!msg["runId"])
            return false;
        
        console.log(`Connected to a new run ${msg["runId"]}`)

        this.current_run = WifiRun.find({ name: msg["runId"]});
        return true;
    }

    private publishMap(): void {
        //creates a chunked stream
        const chunkData = (data: string) => {
            const CHUNK_SIZE = 63 * 1024;
            let chunks = [];

            for(let i = 0; i < data.length; i += CHUNK_SIZE){
                chunks.push(data.slice(i, i + CHUNK_SIZE))
            }

            return chunks;
        }

        console.log(`Publishing map of size`)

        let strMap = JSON.stringify(this.map);
        let chunks = chunkData(strMap);

        console.log(`Number of chunks: ${chunks.length}`);
        console.log(`Size of first chunk: ${chunks[0].length}`)
        console.log(`Size of last chunk: ${chunks[chunks.length - 1].length}`)

        for(let i = 0; i < chunks.length; i++) {
            setTimeout(() => {
                let chunk = chunks[i];
                for(let [key, ele] of this.subscribers)
                {
                    this.server?.send(chunk.toString(), 0, chunk.length, ele.port, ele.address, (err) => {
                        if(err) {
                            //couldn't send, so we need to remove it from the list of subscribers
                            console.log("ERRORED OCCURED")
                            this.subscribers.delete(key);
                            console.error(err)
                        } else {
                            console.log(`Successfully sent ${chunk.length} bytes`)
                        }
                    })
                }
            }, 10 * i)
        }
        console.log("Publish map completed")
    }
}

export default MapServer;