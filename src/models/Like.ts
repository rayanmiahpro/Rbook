// _id   ObjectId pk
//   likedBy ObjectId pk
//   liked ObjectId [post,image,video]
//   createdAt Date
//   updatedAt Date

import mongoose, { Document, Schema } from "mongoose";

export interface ILike extends Document {
  _id: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId;
  liked: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LikeSchema: Schema = new Schema(
  {
    likedBy: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    liked: { type: mongoose.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  }
);

const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", LikeSchema);

export default Like;
