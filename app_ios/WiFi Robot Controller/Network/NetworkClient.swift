//
//  ConnectionHandler.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/12/23.
//

import Foundation
import Network

protocol NetworkDelegate {
    func onMessage(data: String) -> Void
    func isConnected() -> Bool
}

class NetworkClient {
    private var host: String
    private var port: String
    private var type: NWParameters
    
    var connection: NWConnection
    
    private var delegate: any NetworkDelegate
    private var currentBuffer: Data = Data()
    private let maximumTransmissionUnit: Int = 1024
    
    init(_ delegate: any NetworkDelegate, host: String, port: String, using: NWParameters) {
        self.host = host
        self.port = port
        self.type = using
        self.delegate = delegate
        
        self.connection = NWConnection(host: NWEndpoint.Host(self.host), port: NWEndpoint.Port(self.port)!, using: self.type)
        self.connection.stateUpdateHandler = { (newState) in
            if newState == .ready {
                self.receivePackets()
            }
        }
        
        self.connection.start(queue: .global());
    
    }
    
    
    private func receivePackets() {
        self.connection.receive(minimumIncompleteLength: 1, maximumLength: self.maximumTransmissionUnit) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                self.currentBuffer.append(data)
                
                if data.count < self.maximumTransmissionUnit {
                    let bufferStr = String(data: self.currentBuffer, encoding: .utf8)!
                    self.delegate.onMessage(data: bufferStr)
                    self.currentBuffer = Data()
                }
            }
            
            if let error = error {
                print("Received error: \(error)")
                self.connection.cancel()
            } else if isComplete {
                print("Connection was completed")
                self.connection.cancel()
            } else {
                self.receivePackets()
            }
        }
    }
    
    private func receiveMessage() {
        self.connection.receiveMessage { (data, context, isComplete, error) in
                if let data = data, !data.isEmpty {
                    let message = String(data: data, encoding: .utf8)!
                    self.delegate.onMessage(data: message)
                    self.connection.cancel()
                }
            
                if let error = error {
                    print("Error receiving message: \(error.localizedDescription)")
                }
        }
    }
}
