"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WifiSignal = exports.occupancyGridSchema = void 0;
const mongoose_1 = require("mongoose");
exports.occupancyGridSchema = new mongoose_1.Schema({
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    data: { type: [Number] },
    resolution: { type: Number, required: true }
});
exports.WifiSignal = (0, mongoose_1.model)('OccupancyGrid', exports.occupancyGridSchema);
