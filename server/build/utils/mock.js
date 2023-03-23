"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMockWifiRun = exports.CreateMockMap = void 0;
const faker_1 = require("@faker-js/faker");
function CreateMockMap(mapSize) {
    let occupancyGrid = {
        height: mapSize,
        width: mapSize,
        data: [],
        resolution: 0.5
    };
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            occupancyGrid.data.push(Math.floor(Math.random() * 255));
        }
    }
    return occupancyGrid;
}
exports.CreateMockMap = CreateMockMap;
function CreateMockWifiRun() {
    let wifiRun = {
        isRunning: true,
        name: "Initial Run",
        scans: [],
        ranOn: new Date()
    };
    let scans = [];
    for (let i = 0; i < 10; i++) {
        let scan = {
            position: {
                x: 0, y: 0, z: 0
            },
            timestamp: new Date(),
            data: []
        };
        let data = [];
        for (let i = 0; i < 10; i++) {
            let signal = {
                address: faker_1.faker.internet.ipv4(),
                essid: faker_1.faker.address.city(),
                quality: faker_1.faker.datatype.number(70),
                signalLevel: faker_1.faker.datatype.number(70)
            };
            data.push(signal);
        }
        scan.data = data;
        scans.push(scan);
    }
    wifiRun.scans = scans;
    return wifiRun;
}
exports.CreateMockWifiRun = CreateMockWifiRun;
