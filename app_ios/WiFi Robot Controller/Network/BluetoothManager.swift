//
//  BluetoothManager.swift
//  WiFi Robot Controller
//
//  Created by Maguire Krist on 3/11/23.
//

import Foundation
import CoreBluetooth

class BluetoothViewModel: NSObject, ObservableObject, CBCentralManagerDelegate, CBPeripheralDelegate {
    private var centralManager: CBCentralManager?
    @Published var peripherals: [CBPeripheral] = []
    @Published var peripheralNames: [String] = []
    @Published var selectedPeripheral: CBPeripheral?
    @Published var connected: Bool = false
    @Published var connecting: Bool = false
    
    override init() {
        super.init()
        self.centralManager = CBCentralManager(delegate: self, queue: .main)
    }
    
    func connect(_ peripheral: CBPeripheral) {
        self.connected = false
        self.connecting = true
        self.selectedPeripheral = peripheral
        
        if(selectedPeripheral != nil) {
            selectedPeripheral?.delegate = self
            centralManager?.connect(selectedPeripheral!, options: nil)
        }
    }
    
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == .poweredOn {
            self.centralManager?.scanForPeripherals(withServices: nil)
        }
    }

    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
        if !self.peripherals.contains(peripheral) {
            self.peripherals.append(peripheral)
            self.peripheralNames.append(peripheral.name ?? "unnamed device")
        }
    }
    
    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        print("Peripheral connected! " + (peripheral.name ?? "unnamed device"))
        self.connected = true
        self.connecting = false
        self.selectedPeripheral?.discoverServices(nil)
    }
    
    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        self.selectedPeripheral = nil
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        print("didDiscoverSerivces event triggered!")
        if error != nil {
            print("Error occured while discovering serivces for peripheral:" + (peripheral.name ?? "unnamed device"))
        } else {
            print("Services discovered! Amount: ", peripheral.services!.count)
            print(peripheral.services![0].description)
            self.selectedPeripheral?.discoverCharacteristics(nil, for: peripheral.services![0])
        }
    }
    
    //Not needed as I do not reference nested services
//    func peripheral(_ peripheral: CBPeripheral, didDiscoverIncludedServicesFor service: CBService, error: Error?) {
//        if error == nil {
//            print("Discovered serice: " + service.description)
//        } else {
//            print("Error on discovered service!")
//        }
//    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        if error == nil {
            print("Discovered characteristics for service: " + service.description)
            self.selectedPeripheral?.discoverDescriptors(for: service.characteristics![0])
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didDiscoverDescriptorsFor characteristic: CBCharacteristic, error: Error?) {
        if error == nil {
            print("Discovered descriptor for a characteristic")
            print(characteristic.description)
            print(characteristic.properties.contains(CBCharacteristicProperties.read))
            self.selectedPeripheral?.readValue(for: characteristic.descriptors![0])
        }
    }
    
    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor descriptor: CBDescriptor, error: Error?) {
        if error == nil {
            print("Descriptor did update!")
            print(descriptor.value.debugDescription)
        }
    }
}

//class PeripheralViewModel: NSObject, ObservableObject, CBPeripheralDelegate {
//    public var peripheral: CBPeripheral
////    @Published var error: Error? = nil
////    @Published var services: [CBService] = []
//
//    init(_ peripheral: CBPeripheral) {
//        self.peripheral = peripheral
//        print("Peripheral View Model initialized!")
//
//        super.init()
//        self.peripheral.delegate = self;
//        self.peripheral.discoverServices(nil)
//    }
//
//    func connect() {
//
//    }
//
//    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
//        if error != nil {
//            print("Error occured while discovering serivces for peripheral:" + (peripheral.name ?? "unnamed device"))
//        }
//    }
//
//    func peripheral(_ peripheral: CBPeripheral, didDiscoverIncludedServicesFor service: CBService, error: Error?) {
//        if error == nil && !self.services.contains(service) {
//            print("Discovered serice: " + service.description)
////            self.services.append(service)
//        }
//    }
//
//}

//struct PeripheralDetail: View {
//    @ObservedObject private var peripheralViewModel: PeripheralViewModel
//
//    init(peripheral: CBPeripheral) {
//        self.peripheralViewModel = PeripheralViewModel(peripheral)
//    }
//
//    var body: some View {
//        VStack {
////            List(peripheralViewModel.services, id: \.self) { service in
////                Text(service.description)
////            }
//        }
//    }
//}
