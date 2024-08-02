import mongoose from "mongoose";

const BountySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  requiredSkills: [String],
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

const Bounty = mongoose.models.Bounty || mongoose.model("Bounty", BountySchema);

export default Bounty;
