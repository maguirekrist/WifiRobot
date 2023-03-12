"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WifiSignal = exports.wifiSignalSchema = void 0;
const mongoose_1 = require("mongoose");
exports.wifiSignalSchema = new mongoose_1.Schema({
    essid: { type: String, required: true },
    address: { type: String, required: true },
    quality: { type: Number, required: true },
    signalLevel: { type: Number, required: true }
});
exports.WifiSignal = (0, mongoose_1.model)('WifiSignal', exports.wifiSignalSchema);
