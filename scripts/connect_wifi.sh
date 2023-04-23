#!/bin/bash

ESSID=$1
PASS=$2
DEVICE=wlan0


if sudo iwlist $DEVICE scan | grep -q $ESSID; then
        echo "matched"
else
        exit 1
fi

wpa_passphrase $ESSID $PASS | sudo tee /etc/wpa_supplicant.conf

sudo wpa_supplicant -B -c /etc/wpa_supplicant.conf -i $DEVICE

sudo systemctl daemon-reload

sudo systemctl enable wpa_supplicant.service

sudo systemctl enable dhclient.service

exit 0