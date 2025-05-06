// _id ObjectId pk
//   title string
//   discription string
//   image string
//    auther ObjectId pk
//   createdAt Date
//   updatedAt Date

import mongoose, { Document, Schema } from "mongoose";

export interface IImage extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  image: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Image =
  mongoose.models?.Image<IImage> ||
  mongoose.model<IImage>("Image", ImageSchema);

export default Image;
