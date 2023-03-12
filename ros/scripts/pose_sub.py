#!/usr/bin/env python3
from dataclasses import dataclass
from typing import List
import rospy
from rospy import Time
from geometry_msgs.msg import Pose, TransformStamped, Vector3
from nav_msgs.msg import OccupancyGrid
from tf2_msgs.msg import TFMessage
from wifi_polling import get_wireless_data, NetworkStrength
from socket_client import SocketClient
import json
import time

@dataclass
class WifiPoll:
    timestamp: Time
    signals: List[NetworkStrength]
    position: Vector3

class MapNode:
    def __init__(self):
        self.grid = None
        self.sub = rospy.Subscriber("/map", OccupancyGrid, callback=self.map_callback)

    def map_callback(self, map: OccupancyGrid):
        # rospy.loginfo(map)
        self.grid = map

class WifiNode:
    def __init__(self, position = Vector3(0,0,0)):
        self.tb_position: Vector3 = position
        self.wifi_data: WifiPoll = None
        self.sub = rospy.Subscriber("/tf", TFMessage, callback=self.tf_callback)

    def poll(self):
        strengths = get_wireless_data()
        poll = WifiPoll(position=self.tb_position, signals=strengths, timestamp=rospy.get_rostime())
        self.wifi_data = poll

    def tf_callback(self, tf: TFMessage):    
        x: TransformStamped
        for x in tf.transforms:
            if(x.header.frame_id == "map"):
                self.tb_position = x.transform.translation

def encoder_grid(grid: OccupancyGrid):
    if isinstance(grid, OccupancyGrid):
        return { 'grid': grid.data } 
    
def encoder_wifi(wifi: WifiNode):
    if isinstance(wifi, WifiNode):
        jit = []
        for i in wifi.wifi_data.signals:
            jit.append({ 
                'essid': i.essid,
                'quality': i.quality,
                'signalLevel': i.signalLevel,
                'address': i.address    
            })

        temp = {
            'position': {
                'x': wifi.wifi_data.position.x,
                'y': wifi.wifi_data.position.y,
                'z': wifi.wifi_data.position.z
            },
            'timestamp': wifi.wifi_data.timestamp.secs * 1000,
            'data': jit
        }
        return temp
        
# def chunk_map_data(grid: str) -> List[str]:
#     CHUNK_SIZE = 63 * 1024
#     print(len(grid))
#     return [grid[i:i+CHUNK_SIZE] for i in range(0, len(grid), CHUNK_SIZE)]
    
if __name__ == '__main__':
    rospy.init_node("pose_sub")
    
    wifiNode = WifiNode()
    mapNode = MapNode()

    map_client = SocketClient(3001)
    wifi_client = SocketClient(3002)

    wifi_client.transmit(json.dumps({ 'runId': 'default run' }))
    map_client.transmit(json.dumps({ 'runId': 'default run' }))

    didSend = False

    rospy.loginfo("Node has been started!")
    rate = rospy.Rate(0.4)

    while not rospy.is_shutdown():
        if(mapNode.grid is not None and didSend is False):
          map_client.transmit(json.dumps(mapNode.grid, encoder_grid))
          didSend = True

        rospy.loginfo("Polling...")
        wifiNode.poll()
        wifi_client.transmit(json.dumps(wifiNode, default=encoder_wifi))

        rate.sleep()
    
    # map_client.close()
    wifi_client.close()

