import { Schema, model } from "mongoose";


export interface IVector3D {
    x: number;
    y: number;
    z: number;
}

export const vector3DSchema = new Schema<IVector3D>({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    z: { type: Number, required: true }
});

export const Vector3D = model<IVector3D>('Vector3d', vector3DSchema);
