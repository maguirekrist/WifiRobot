//
//  ContentView.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 2/2/23.
//

import SwiftUI
import CoreBluetooth

struct PeripheralRow: View {
    var peripheral: CBPeripheral
    
    init(peripheral: CBPeripheral) {
        self.peripheral = peripheral
    }
    
    var body: some View {
        HStack {
            Text(peripheral.name ?? "unnamed device")
        }
    }
}

struct ContentView: View {
    @ObservedObject private var bluetoothViewModel = BluetoothViewModel()
    
    var body: some View {
        if(bluetoothViewModel.connecting) {
            ProgressView()
        } else {
            if(!bluetoothViewModel.connected) {
//                List(bluetoothViewModel.peripherals, id: \.self) { peripheral in
//                    HStack {
//                        Text(peripheral.name ?? "unnamed device")
//                        Spacer()
//                    }
//                    .onTapGesture {
//                        print("Attempting connection with peripheral!")
//                        bluetoothViewModel.connect(peripheral)
//                    }
//                }
                VStack {
                    MetalView()
                        .frame(height: 300)
                    WifiListView()
//                    Spacer()
//
//                    Group {
//                        Text("Welcome!")
//                        Button(action: {
//                        }, label: {
//                            Text("Connect to Turtlebot")
//                                .foregroundColor(.white)
//                                .frame(width: 200, height: 40)
//                                .background(Color.green)
//                                .cornerRadius(15)
//                                .padding()
//                        })
//
//                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .edgesIgnoringSafeArea(.top)
            } else {
                if(bluetoothViewModel.selectedPeripheral?.services != nil) {
                    List(bluetoothViewModel.selectedPeripheral!.services!, id: \.self) { service in
                        Text(service.description)
                    }
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
