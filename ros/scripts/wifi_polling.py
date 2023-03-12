#!/usr/bin/env python3
import subprocess
import re
from re import Pattern
from dataclasses import dataclass
from typing import List
from geometry_msgs.msg import Vector3

scan_command = 'iwlist wlo1 scan'.split()

@dataclass
class NetworkStrength:
    essid: str
    quality: str
    signalLevel: int
    address: str

def get_wireless_data() -> List[NetworkStrength]:
    cmd1 = subprocess.Popen(['echo', 'peep'], stdout=subprocess.PIPE)
    cmd2 = subprocess.Popen(['sudo', '-S'] + scan_command, stdin=cmd1.stdout, stdout=subprocess.PIPE)
    
    out = cmd2.stdout.read().decode()

    essid_re = re.compile(r'ESSID:\"([ -~]+)\"')
    address_re = re.compile(r'Address: ([ -~]+)')
    qualtiy_re = re.compile(r'Quality=([0-9]+)/[0-9]+')
    signal_re = re.compile(r'Signal level=([-+][0-9]+) dBm')

    signals: List[NetworkStrength] = []

    for ele in out.split('Cell'):
        essid = essid_re.findall(ele)
        quality = qualtiy_re.findall(ele)
        signal = signal_re.findall(ele)
        address = address_re.findall(ele)



        if(essid and not any(x.essid == essid[0] for x in signals)):
            signals.append(NetworkStrength(essid=essid[0], quality=int(quality[0]), signalLevel=int(signal[0]), address=address[0]))
    
    signals.sort(key=lambda x: x.quality, reverse=True)
    return signals
    