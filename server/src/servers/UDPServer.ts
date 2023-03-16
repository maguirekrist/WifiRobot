import dgram from 'node:dgram'

export interface ISocketServerDelegate {
    port: number;
    onError?: (err: Error) => void;
    onClose?: () => void;
    onMessage: (msg: Buffer, rinfo: dgram.RemoteInfo) => void;
    onListening?: (server: dgram.Socket) => void;
}

export class UDPServer {
    server: dgram.Socket;
    port: number;

    constructor(delegate: ISocketServerDelegate) {
        this.server = dgram.createSocket('udp4')
        this.port = delegate.port;

        this.server.on('error', (err) => {
            delegate.onError?.(err);
            this.server.close();
        });
        
        this.server.on('close', () => {
            delegate.onClose?.();
            console.log("UDP server has been closed")
        })

        this.server.on('message', (msg, rinfo) => {
            delegate.onMessage(msg, rinfo);
        });
        
        this.server.on('listening', () => {
            delegate.onListening?.(this.server);
            const address = this.server.address()
            console.log(`Socket listening on ${address.address}:${address.port}`)
        });

        this.server.on('connect', () => {
            console.log("Somethign has connected to the server!")
        })
    }

    listen() {
        this.server.bind(this.port, process.env.HOST_ADDRESS);
    }
}