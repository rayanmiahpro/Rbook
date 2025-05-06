

import mongoose, { Document, Schema } from "mongoose";

export interface IVideo extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  video: string;
  thumbnail: string;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: true }
);

const Video =
  mongoose.models?.Video<IVideo> || mongoose.model<IVideo>("Video", VideoSchema);

export default Video;
