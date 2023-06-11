import { IUser } from "./interface";
import { Schema, model } from "mongoose";
/**
 * @openapi
 * definitions:
 *   CreateUserSchema:
 *     type: object
 *     properties:
 *       name: 
 *         type: string
 *         required: true
 *         example: mohit 
 *       email: 
 *         type: string
 *         required: true 
 *         example: mohit@example.com 
 *       password: 
 *         type: string 
 *         required: true 
 *         example: mohit@example.com 
 *  
 */
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true},
  createdAt: { type: Date, required: true, default: Date.now },
});

const UserModel = model<IUser>("Users", userSchema);

export default UserModel;