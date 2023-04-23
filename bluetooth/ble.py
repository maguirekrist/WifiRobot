#!/usr/bin/env python3
#BLE api
import dbus
import dbus.exceptions
import dbus.mainloop.glib
import dbus.service

import array
from gi.repository import GLib
import logging
import uuid
import json
from urllib import request
import subprocess

from bluez import *

mainloop = None

class TestService(Service):
    TURTLEBOT_UUID = "12634d89-d598-4874-8e86-7d042ee07ba7"

    def __init__(self, bus, index):
        Service.__init__(self, bus, index, self.TURTLEBOT_UUID, True)
        self.add_characteristic(ConnectWifiCharacteristic(bus, 0, ["read", "write-without-response"], self))
        self.add_characteristic(InitializeRosCharacteristic(bus, 1, ["read", "write-without-response"], self))

class ConnectWifiCharacteristic(Characteristic):
    UUID = "4116f8d2-9f66-4f58-a53d-fc7440e7c14c"
    description = b"Attempt to connect to Wifi { essid: <ESSID>, pass: <PASS> }"

    def __init__(self, bus, index, flags, service):
        Characteristic.__init__(self, bus, index, self.UUID, flags, service)
        self.add_descriptor(IsWifiConnectedDescriptor(bus, 2, self))

        self.value = None

    def ReadValue(self, options):
        return self.value
    
    def WriteValue(self, value, options):
        print("Write attempt triggered!")
        # decode dbus.Array of dbus.Byte
        bytes_data = bytes(value)
        string_data = bytes_data.decode("utf-8")
        json_data = json.loads(string_data)

        print(json_data["essid"])
        print(json_data["pass"])
        

        exit_code = subprocess.call(["../scripts/connect_wifi.sh", json_data["essid"], json_data["pass"]])
        
        print(exit_code)

        self.value = bytearray(string_data, "utf-8")
        # return super().WriteValue(value, options)

class InitializeRosCharacteristic(Characteristic):
    UUID = "4116f8d2-9f66-4f58-a53d-fc7440e7c14e"
    description = b"Turn on/off ROS (toggles on write)"

    def __init__(self, bus, index, flags, service):
        Characteristic.__init__(self, bus, index, self.UUID, flags, service)

        self.value = False

    def ReadValue(self, options):
        return self.value
    
    def WriteValue(self, value, options):
        self.value = True if self.value == False else False
        return super().WriteValue(value, options)


# class TestCharacteristic(Characteristic):
#     UUID = "4116f8d2-9f66-4f58-a53d-fc7440e7c14e"
#     description = b"Get/set machine power state {'ON', 'OFF', 'UNKNOWN'}"
    
#     def __init__(self, bus, index, flags, service):
#         Characteristic.__init__(self, bus, index, self.UUID, flags, service)

#         self.value = bytearray('fart', "utf-8")
#         self.add_descriptor(CharacteristicUserDescriptionDescriptor(bus, 1, self))

#     def ReadValue(self, options):
#         return self.value
    
#     def WriteValue(self, value, options):
#         print("Write attempt triggered!")
#         # decode dbus.Array of dbus.Byte
#         bytes_data = bytes(value)
#         string_data = bytes_data.decode("utf-8")
#         print(string_data)
#         self.value = bytearray(string_data, "utf-8")
#         return super().WriteValue(value, options)
    
class IsWifiConnectedDescriptor(Descriptor):
    """
    Readable Descriptor to check if Bot is successfully connected to WiFi.
    """
    CUD_UUID = "2901"

    def __init__(
        self, bus, index, characteristic,
    ):

        self.value = False
        Descriptor.__init__(self, bus, index, self.CUD_UUID, ["read"], characteristic)

    def CheckSignal() -> bool:
        try:
            request.urlopen('http://8.8.8.8', timeout=1)
            return True
        except request.URLError as err:
            return False

    def ReadValue(self, options):
        self.value = self.CheckSignal()
        return self.value

    def WriteValue(self, value, options):
        if not self.writable:
            raise NotPermittedException()
        self.value = value

class TestAdvertisement(Advertisement):
    def __init__(self, bus, index):
        Advertisement.__init__(self, bus, index, 'peripheral')
        # self.add_service_uuid('0x1800')
        # self.add_service_uuid('0x1801')
        # self.add_service_uuid('0x1802')
        self.add_service_uuid(TestService.TURTLEBOT_UUID)
        self.add_local_name("Turtlebot")
        self.set_discoverable()
        self.include_tx_power = False
        # self.add_manufacturer_data(0xffff, [0x12, 0x34])
        # self.include_tx_power = True

def register_ad_cb():
    print('Advertisement registered')

def register_ad_error_cb(error):
    print('Failed to register advertisement: ' + str(error))
    mainloop.quit()

def register_app_cb():
    print("Application Registered!")

def register_app_error_cb():
    mainloop.quit()

def find_adapter(bus: dbus.SystemBus):
    proxy = bus.get_object(BLUEZ_SERVICE_NAME, '/')
    remote_om = dbus.Interface(proxy, DBUS_OM_IFACE)

    objects = remote_om.GetManagedObjects()

    for o, props in objects.items():
        if GATT_MANAGER_IFACE in props.keys():
            return o

    return None

def main():
    global mainloop
    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

    bus = dbus.SystemBus()
    adapter = find_adapter(bus)

    print(adapter)

    adapter_obj = bus.get_object(BLUEZ_SERVICE_NAME, adapter)
    adapter_props = dbus.Interface(adapter_obj, DBUS_PROP_IFACE)

    # power on the bluetooth driver
    adapter_props.Set("org.bluez.Adapter1", "Powered", dbus.Boolean(1))

    ad_manager = dbus.Interface(bus.get_object(BLUEZ_SERVICE_NAME, adapter), LE_ADVERTISING_MANAGER_IFACE)

    test_ad = TestAdvertisement(bus, 0)

    mainloop = GLib.MainLoop()
    
    app = Application(bus)
    app.add_service(TestService(bus, 2))
    service_manager = dbus.Interface(adapter_obj, GATT_MANAGER_IFACE)
    service_manager.RegisterApplication(
        app.get_path(),
        {},
        reply_handler=register_app_cb,
        error_handler=register_app_error_cb
    )

    ad_manager.RegisterAdvertisement(test_ad.get_path(), {}, 
    reply_handler=register_ad_cb,
    error_handler=register_ad_error_cb)

    mainloop.run()

    ad_manager.UnregisterAdvertisement(test_ad)
    service_manager.UnregisterApplication(app)
    print('Objects unregistered')
    dbus.service.Object.remove_from_connection(test_ad)

if __name__ == '__main__':
    main()