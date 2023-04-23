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
        self.map_translation: Vector3 = Vector3(0, 0, 0)
        self.odom_tranlsation: Vector3 = Vector3(0, 0, 0)
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
                self.map_translation = x.transform.translation
            if(x.header.frame_id == "odom"):
                self.odom_tranlsation = x.transform.translation
            if(x.header.frame_id == "base_link"):
                baseLink = x.transform.translation

        self.tb_position = Vector3(self.map_translation.x + self.odom_tranlsation.x, 
                                   self.map_translation.y + self.odom_tranlsation.y,
                                   self.map_translation.z + self.odom_tranlsation.z)
            

def encoder_grid(grid: OccupancyGrid):
    if isinstance(grid, OccupancyGrid):
        return { 'data': grid.data, 'width': grid.info.width, 'height': grid.info.height, 'resolution': grid.info.resolution } 
    
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
                'x': round(wifi.wifi_data.position.x, 2),
                'y': round(wifi.wifi_data.position.y, 2),
                'z': round(wifi.wifi_data.position.z, 2)
            },
            'timestamp': wifi.wifi_data.timestamp.secs * 1000,
            'data': jit
        }
        return temp
        
# def chunk_map_data(grid: str) -> List[str]:
#     CHUNK_SIZE = 63 * 1024
#     print(len(grid))
#     return [grid[i:i+CHUNK_SIZE] for i in range(0, len(grid), CHUNK_SIZE)]
def should_poll(last_pos: Vector3, current_pos: Vector3) -> bool:
    resolution = 0.25
    change_x = abs(last_pos.x - current_pos.x)
    change_y = abs(last_pos.y - current_pos.y)

    return change_x > resolution or change_y > resolution


if __name__ == '__main__':
    rospy.init_node("pose_sub")
    
    wifiNode = WifiNode()
    mapNode = MapNode()

    map_client = SocketClient(3001)
    wifi_client = SocketClient(3002)

    run_id = "1"
    map_client.transmit(json.dumps({ 'runId': run_id }))
    wifi_client.transmit(json.dumps({ 'runId': run_id }))

    rate = rospy.Rate(0.4)

    last_pos = Vector3(-10, -10, 0)

    rate.sleep()

    while not rospy.is_shutdown():
        if(should_poll(last_pos, wifiNode.tb_position)):                
            if(mapNode.grid is not None):
                map_client.transmit(json.dumps(mapNode.grid, default=encoder_grid))
            #   rospy.loginfo(mapNode.grid.info.resolution)

            # rospy.loginfo(wifiNode.tb_position)
            rospy.loginfo("Polling...")
            wifiNode.poll()
            wifi_client.transmit(json.dumps(wifiNode, default=encoder_wifi))
            last_pos = wifiNode.tb_position
            rate.sleep()
        
    map_client.close()
    wifi_client.close()

