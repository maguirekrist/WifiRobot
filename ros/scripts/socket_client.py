import socket

HOST = "192.168.1.76" # the socket server's hostname or IP address

class SocketClient:
    def __init__(self, port):
        self.server_address = (HOST, port)
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    def ping(self):
        self.socket.sendto(b"Hello, world", self.server_address)

    def transmit(self, data: str):
        self.socket.sendto(bytes(data, 'utf-8'), self.server_address)

    def close(self):
        self.socket.close()



