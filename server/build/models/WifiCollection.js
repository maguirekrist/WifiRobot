"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WifiCollection = exports.wifiCollectionSchema = void 0;
const mongoose_1 = require("mongoose");
const Vector3d_1 = require("./Vector3d");
const WifiSignal_1 = require("./WifiSignal");
exports.wifiCollectionSchema = new mongoose_1.Schema({
    timestamp: { type: Date, required: true, default: Date.now() },
    data: { type: [WifiSignal_1.wifiSignalSchema] },
    position: { type: Vector3d_1.vector3DSchema, required: true, default: { x: 0, y: 0, z: 0 } }
});
exports.WifiCollection = (0, mongoose_1.model)('WifiCollection', exports.wifiCollectionSchema);
