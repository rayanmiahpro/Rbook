import mongoose, { Schema, Document } from "mongoose";

export interface IFlower extends Document {
  _id: mongoose.Types.ObjectId;
  flowedBy: mongoose.Types.ObjectId;
  flowed: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FlowerSchema: Schema = new Schema(
  {
    flowedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flowed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Flower =
  mongoose.models?.Flower<IFlower> ||
  mongoose.model<IFlower>("Flower", FlowerSchema);

export default Flower;
