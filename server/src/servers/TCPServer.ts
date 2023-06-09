import { RemoteInfo } from 'dgram';
import net from 'net';

export interface ITcpSocket {
    port: number;
    onError?: (client: net.Socket) => void;
    onClose?: (client: net.Socket) => void;
    onMessage: (msg: Buffer, rinfo: RemoteInfo) => void;
    onConnect: (server: net.Socket) => void;
    onDrain?: (client: net.Socket) => void;
}


export class TCPServer {
    server: net.Server;
    senders: Map<net.Socket, number> = new Map();
    delegate: ITcpSocket;
    buffer: Buffer = Buffer.from("");

    constructor(delegate: ITcpSocket) {
        this.delegate = delegate;
        //The call back on createServer is actually the connection event
        this.server = net.createServer((socket) => {
            console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected`);
            delegate.onConnect(socket)

            socket.on('data', (data) => {
                this.buffer = Buffer.concat([this.buffer, data]);
                if(data.byteLength != parseInt(process.env.MTU!) && this.buffer.byteLength != 0)
                {
                    this.senders.set(socket, 1);
                    delegate.onMessage(this.buffer, { address: socket.remoteAddress!, family: "IPv4", port: socket.remotePort!, size: socket.readableHighWaterMark });
                    this.buffer = Buffer.from("");
                }
            })

            socket.on('end', () => {
                delegate.onClose?.(socket);
                console.log(`Client ${socket.remoteAddress}:${socket.remotePort} disconnected`);
            })

            socket.on('timeout', () => {
                console.log("TIMEOUT EVENT")
            })

            socket.on('drain', () => {
                delegate.onDrain?.(socket)
            })

            socket.on('error', () => {
                delegate.onError?.(socket);
            })
        })
    }

    listen() {
        this.server.listen(this.delegate.port, process.env.HOST_ADDRESS, () => {
            console.log("Server listening on port " + this.delegate.port)
        })
    }
} 