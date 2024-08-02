import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true },
  requiredSkills: [String],
  attachments: [String],
  status: {
    type: String,
    enum: ["open", "in-progress", "completed"],
    default: "open",
  },
  applications: [
    {
      mentee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
      message: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
