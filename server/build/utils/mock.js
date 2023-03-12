"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMockMap = void 0;
function CreateMockMap(mapSize) {
    let occupancyGrid = {
        height: mapSize,
        width: mapSize,
        data: []
    };
    for (let i = 0; i < mapSize; i++) {
        for (let j = 0; j < mapSize; j++) {
            occupancyGrid.data.push(Math.floor(Math.random() * 10));
        }
    }
    return occupancyGrid;
}
exports.CreateMockMap = CreateMockMap;
