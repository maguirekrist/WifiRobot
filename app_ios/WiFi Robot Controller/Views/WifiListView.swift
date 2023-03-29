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
        List {
            ForEach(Array(wifiModel.wifiMap.keys), id: \.self) { key in
                HStack {
                    Text(key)
                }
            }
        }
    }
}
