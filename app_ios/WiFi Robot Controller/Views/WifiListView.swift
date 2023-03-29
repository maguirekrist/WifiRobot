//
//  WifiListView.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/13/23.
//

import Foundation
import SwiftUI

struct WifiListView: View {
    let wifiSelectionController: WifiViewController
    
    @ObservedObject var wifiModel = WifiDataProvider()
    
    init(controller: WifiViewController) {
        self.wifiSelectionController = controller;
    }
    
    var body: some View {
        Text("Default Run: ")
        List {
            ForEach(Array(wifiModel.wifiMap.keys), id: \.self) { key in
                HStack {
                    Text(key)
                }.onTapGesture {
                    self.wifiSelectionController.setWifiSelection(WifiSelection(label: key, points: self.wifiModel.wifiMap[key]!))
                }
            }
        }
    }
}
