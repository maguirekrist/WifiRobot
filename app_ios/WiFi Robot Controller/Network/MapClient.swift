//
//  MapClient.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/9/23.
//

import Foundation
import Network

struct OccupancyGrid: Codable {
    var width: Int
    var height: Int
    var data: [UInt8]
}

class MapClient {
    private var host: String;
    private var port: IntegerLiteralType;
    
    private var connection: NWConnection;
    private var streaming: Bool = false;
    
    
    init(host: String = "192.168.1.76", port: IntegerLiteralType = 3001) {
        self.host = host
        self.port = port
        
        do {
            self.connection = NWConnection(host: NWEndpoint.Host(self.host), port: NWEndpoint.Port(3001), using: .tcp)
            self.connection.stateUpdateHandler = { (newState) in
                if newState == .ready {
                    self.receivePackets()
                }
            }
            
            self.connection.start(queue: .global());
        } catch {
            print("Error creating connection: \(error.localizedDescription)")
        }
    }
    
    private func receiveMessage() {
        self.connection.receiveMessage { (data, context, isComplete, error) in
                if let data = data, !data.isEmpty {
                    let message = String(data: data, encoding: .utf8)!
                    let decoder = JSONDecoder()
                    let occupancyGrid = try! decoder.decode(OccupancyGrid.self, from: message.data(using: .utf8)!)
                    print("Sucessfully got map: ", occupancyGrid.width)
                    self.connection.cancel()
                }
            
                if let error = error {
                    print("Error receiving message: \(error.localizedDescription)")
                }
        }
    }

    private func receivePackets() {
        self.connection.receive(minimumIncompleteLength: 1, maximumLength: 1024) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                print("Received data size: \(data.count)")
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
}
