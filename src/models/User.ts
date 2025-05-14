import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  FullName: string;
  username: string;
  email: string;
  varifyCode: string;
  varifyCodeExpiry: Date;
  isVarified: boolean;
  password: string;
  avator: string;
  coverImage: string;
  videos: Array<any>;
  images: Array<any>;
  posts: Array<any>;
  flollowers: Array<any>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    FullName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    varifyCode: { type: String, required: true },
    varifyCodeExpiry: { type: Date, required: true },
    password: { type: String, required: true },
    avator: { type: String, required: true },
    coverImage: { type: String, default: "" },
    isVarified: { type: Boolean, default: false },
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    flollowers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const User =
  mongoose.models?.User<IUser> || mongoose.model<IUser>("User", userSchema);

export default User;
