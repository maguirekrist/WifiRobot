import { IOccupancyGrid } from "../models/OccupancyGrid";


export function CreateMockMap(mapSize: number): IOccupancyGrid {
    let occupancyGrid: IOccupancyGrid = {
        height: mapSize,
        width: mapSize,
        data: []
    }

    for(let i = 0; i < mapSize; i++) {
        for(let j = 0; j < mapSize; j++) {
            occupancyGrid.data.push(Math.floor(Math.random() * 10));
        }
    }

    return occupancyGrid;
}