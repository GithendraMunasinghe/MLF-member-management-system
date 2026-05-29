import mongoose from "mongoose";

const coordinatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    coordinatorId: {
      type: String,
      required: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
    },

    photo: {
      type: String, // /uploads/filename.jpg
    },

  },
  { timestamps: true }
);

export default mongoose.model("Coordinator", coordinatorSchema);