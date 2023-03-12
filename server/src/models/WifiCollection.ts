import { Schema, model, connect, Date } from 'mongoose';
import { IVector3D, vector3DSchema } from './Vector3d';
import { IWifiSignal, wifiSignalSchema } from './WifiSignal';

export interface IWifiCollection {
    timestamp: Date;
    data: IWifiSignal[];
    position: IVector3D;
}

export const wifiCollectionSchema = new Schema<IWifiCollection>({
    timestamp: { type: Date, required: true, default: Date.now() },
    data: { type: [ wifiSignalSchema ] },
    position: { type: vector3DSchema, required: true, default: { x: 0, y: 0, z: 0 } }
});

export const WifiCollection = model<IWifiCollection>('WifiCollection', wifiCollectionSchema);