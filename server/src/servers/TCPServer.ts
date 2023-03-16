import { RemoteInfo } from 'dgram';
import net from 'net';
export interface ITcpSocket {
    port: number;
    onError?: (err: Error) => void;
    onClose?: (client: net.Socket) => void;
    onMessage: (msg: Buffer, rinfo: RemoteInfo) => void;
    onConnect: (server: net.Socket) => void;
    onDrain?: (client: net.Socket) => void;
}


export class TCPServer {
    socket?: net.Socket;
    server: net.Server;
    delegate: ITcpSocket;

    constructor(delegate: ITcpSocket) {
        this.delegate = delegate;
        this.server = net.createServer((socket) => {
            this.socket = socket;
            console.log(`Client ${socket.remoteAddress}:${socket.remotePort} connected`);
            delegate.onConnect(this.socket)

            socket.on('data', (data) => {
                delegate.onMessage(data, { address: socket.remoteAddress!, family: "IPv4", port: socket.remotePort!, size: 0 });
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
        })
    }

    listen() {
        this.server.listen(this.delegate.port, process.env.HOST_ADDRESS, () => {
            console.log("Server listening on port " + this.delegate.port)
        })
    }
} 