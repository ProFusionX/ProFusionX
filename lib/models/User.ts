import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "mentee" | "mentor";
  bio?: string;
  skills?: string[];
  createdAt: Date;
  profile?: {
    experienceLevel?: string;
    learningGoals?: string;
    expertise?: string;
    companyAffiliation?: string;
    mentoringInterests?: string;
  };
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [60, "Name cannot be more than 60 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  role: {
    type: String,
    enum: ["mentee", "mentor"],
    required: true,
  },
  bio: String,
  skills: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  profile: {
    experienceLevel: String,
    learningGoals: String,
    expertise: String,
    companyAffiliation: String,
    mentoringInterests: String,
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
