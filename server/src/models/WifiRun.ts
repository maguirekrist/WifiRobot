import { Schema, model, connect } from 'mongoose';
import { IOccupancyGrid, occupancyGridSchema } from './OccupancyGrid';
import { IVector3D, vector3DSchema } from './Vector3d';
import { IWifiCollection, wifiCollectionSchema } from './WifiCollection';

export interface IWifiRun {
    ranOn: Date;
    name: string;
    scans: IWifiCollection[];
    map?: IOccupancyGrid
    isRunning: boolean;
}

export const wifiRunSchema = new Schema<IWifiRun>({
    ranOn: { type: Date, required: true, default: Date.now() },
    scans: { type: [ wifiCollectionSchema ] },
    name: { type: String, required: true },
    map: { type: occupancyGridSchema , required: false },
    isRunning: { type: Boolean, required: false, default: false }
});

export const WifiRun = model<IWifiRun>('WifiRun', wifiRunSchema);