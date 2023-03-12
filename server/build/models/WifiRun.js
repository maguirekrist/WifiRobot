"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WifiRun = exports.wifiRunSchema = void 0;
const mongoose_1 = require("mongoose");
const OccupancyGrid_1 = require("./OccupancyGrid");
const WifiCollection_1 = require("./WifiCollection");
exports.wifiRunSchema = new mongoose_1.Schema({
    ranOn: { type: Date, required: true, default: Date.now() },
    scans: { type: [WifiCollection_1.wifiCollectionSchema] },
    name: { type: String, required: true },
    map: { type: OccupancyGrid_1.occupancyGridSchema, required: false },
    isRunning: { type: Boolean, required: false, default: false }
});
exports.WifiRun = (0, mongoose_1.model)('WifiRun', exports.wifiRunSchema);
