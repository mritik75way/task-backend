import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  refreshToken?: string;
}

const userSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true, required: true },
  password: {type: String, required: true},
  resetPasswordToken: {type: String},
  resetPasswordExpires: {type: Date},
  refreshToken: { type: String }
});


export default mongoose.model<IUser>("User", userSchema);
