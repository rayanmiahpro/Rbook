// id ObjectId pk
//   content string
//   commentBy ObjectId
//   commented ObjectId [post,Image,Video]
//   createdAt Date
//   updatedAt Date

import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  content: string;
  commentBy: mongoose.Types.ObjectId;
  commented: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: {
      type: String,
      required: true,
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    commented: {
      type: Schema.Types.ObjectId,

      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment =
  mongoose.models?.Comment<IComment> ||
  mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
