"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3D = exports.vector3DSchema = void 0;
const mongoose_1 = require("mongoose");
exports.vector3DSchema = new mongoose_1.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
});
exports.Vector3D = (0, mongoose_1.model)('Vector3d', exports.vector3DSchema);
