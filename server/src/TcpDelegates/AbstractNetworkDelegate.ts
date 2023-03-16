import { RemoteInfo } from "dgram";
import { Socket } from "net";
import { ITcpSocket, TCPServer } from "../servers/TCPServer";
import net from 'net'

abstract class NetworkDelegate implements ITcpSocket {
    port: number;
    clients: net.Socket[] = []
    server: TCPServer;

    constructor(port: number) {
        this.port = port;
        this.server = new TCPServer(this);
    }

    abstract onMessage(msg: Buffer, rinfo: RemoteInfo): void;

    onError?: ((err: Error) => void) | undefined;
    onDrain?: ((client: Socket) => void) | undefined;

    onConnect(socket: net.Socket): void {
        this.clients.push(socket);
    }

    onClose(client: net.Socket) {
        this.clients = this.clients.filter(c => c !== client);
    }

    listen() {
        this.server.listen();
    }
}

export default NetworkDelegate