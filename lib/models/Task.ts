// lib/models/Task.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  price: number;
  mentor: mongoose.Types.ObjectId;
  status: string;
  mentee?: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mentor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed'],
    default: 'open',
  },
  mentee: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Task: Model<ITask> = mongoose.models.Task || mongoose.model('Task', TaskSchema);
export default Task;