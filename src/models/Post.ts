//  _id ObjectId pk
//   content string
//    auther ObjectId pk
//   createdAt Date
//   updatedAt Date

import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  auther: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    auther: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Post =
  mongoose.models?.Post<IPost> || mongoose.model<IPost>("Post", PostSchema);
