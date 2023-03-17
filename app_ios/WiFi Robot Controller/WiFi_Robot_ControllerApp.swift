//
//  WiFi_Robot_ControllerApp.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 2/2/23.
//

import SwiftUI
import CoreBluetooth

@main
struct WiFi_Robot_ControllerApp: App {

    var body: some Scene {
        WindowGroup {
            LiveFeedView()
        }
    }
}
//
//public func bluetoothScan() {
//    let BTManager = CBCentralManager()
//    BTManager.scanForPeripherals(withServices: nil)
//}
