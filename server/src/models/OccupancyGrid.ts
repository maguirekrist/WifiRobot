import { Schema, model } from "mongoose";


export interface IOccupancyGrid {
    width: number;
    height: number;
    data: number[];
}

export const occupancyGridSchema = new Schema<IOccupancyGrid>({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    data: { type: [ Number ] }
})

export const WifiSignal = model<IOccupancyGrid>('OccupancyGrid', occupancyGridSchema);