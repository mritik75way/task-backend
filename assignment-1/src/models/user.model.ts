import { Schema, model } from 'mongoose'

export interface User {
  email: string
  roles: string[]
  password: string
}

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  roles: { type: [String], required: true },
  password: { type: String, required: true }
}, { timestamps: true })

export const UserModel = model<User>('User', userSchema)
