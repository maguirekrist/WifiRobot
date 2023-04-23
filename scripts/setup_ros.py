#!/usr/bin/env python3
import subprocess

def launch_ros():
    process = subprocess.Popen(['roscore'], stdout=subprocess.PIPE)
    while True:
        output = process.stdout.readline()
        if output:
            print(output.strip())

if __name__ == '__main__':
    print("Launching roscore...")
    launch_ros()
