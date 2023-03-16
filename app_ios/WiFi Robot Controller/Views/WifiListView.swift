//
//  WifiListView.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/13/23.
//

import Foundation
import SwiftUI

struct WifiListView: View {
    @ObservedObject var wifiModel = WifiDataProvider()
    
    var body: some View {
        Text("Default Run: ")
        List(wifiModel.wifiCollections, id: \.self) { collection in
            HStack {
                Text(collection.timestamp.ISO8601Format(.iso8601))
            }
        }
    }
}
