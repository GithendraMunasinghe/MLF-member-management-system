import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    //Link to Organization (IMPORTANT)
    organizationType: {
      type: String,
      enum: ["Foundation", "IBDF"],
      required: true,
    },

    // Optional (future upgrade → use organizationId instead)
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
      type: String, // /uploads/logo.png
    },

  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);