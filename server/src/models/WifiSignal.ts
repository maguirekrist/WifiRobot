import { Schema, model, connect, Date } from 'mongoose';

export interface IWifiSignal {
    essid: string;
    address: string;
    quality: number;
    signalLevel: number;
}

export const wifiSignalSchema = new Schema<IWifiSignal>({
    essid: { type: String, required: true },
    address: { type: String, required: true },
    quality: { type: Number, required: true },
    signalLevel: { type: Number, required: true}
})

export const WifiSignal = model<IWifiSignal>('WifiSignal', wifiSignalSchema);