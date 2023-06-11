import { ITask } from "./interface";
import { Schema, model, Mongoose } from "mongoose";
/**
 * @openapi
 * definitions:
 *   CreateTaskSchema:
 *     type: object
 *     properties:
 *       title: 
 *         type: string
 *         required: true
 *         example: Demo task 
 *       summary: 
 *         type: string
 *         required: true 
 *         example: demo task summary
 *  
 */
const taskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  summary:  { type: String, required: true },
  createdBy:  { type: String, required: true },
  completed:  { type: Boolean, required: false, default: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

const TaskModel = model<ITask>("Tasks", taskSchema);

export default TaskModel;