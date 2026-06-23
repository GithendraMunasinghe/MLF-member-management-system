import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    organizationType: {
      type: String,
      enum: ["Foundation", "IBDF"],
      required: true,
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    date: {
      type: Date,
    },

    description: {
      type: String,
    },

    logo: {
      type: String,
    },

    // NEW
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);