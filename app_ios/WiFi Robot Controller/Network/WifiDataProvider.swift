//
//  WifiClient.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/12/23.
//

import Foundation

class WifiDataProvider: ObservableObject, NetworkDelegate {
    @Published var wifiCollections: [WifiCollection] = []
    @Published var wifiMap: Dictionary<String, [WifiPoint]> = [String: [WifiPoint]]()
    
    private var client: NetworkClient!
    private var dateFormatter: DateFormatter!
    
    init() {
        self.client = NetworkClient(self, host: "192.168.1.81", port: "3002", using: .tcp)
        self.dateFormatter = DateFormatter()
        self.dateFormatter.locale = Locale(identifier: "en_US_POSIX")
        self.dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    }
    
    func isConnected() -> Bool {
        self.client.connection.state == .ready
    }
    
    func onMessage(data: String) {
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .formatted(self.dateFormatter)
        DispatchQueue.main.async {
            do {
                let collection = try decoder.decode(WifiCollection.self, from: data.data(using: .utf8)!)
                self.wifiCollections.append(collection)
                for e in collection.data {
                    var point: WifiPoint = WifiPoint(signal: e, position: collection.position, timestamp: collection.timestamp)
                    if var pointArr = self.wifiMap[e.address] {
//                        self.wifiMap[e.address]!.append(point)
                        pointArr.append(point)
                    } else {
                        self.wifiMap[e.address] = [point]
                    }
                }
                self.objectWillChange.send() //Apparently we need this hack, because dictionary updates do not get propogated by default to subscribers listening
            } catch let error {
                print("Error occured whilst decoding incoming wifi collection: \(error)")
            }
        }
    }
}
