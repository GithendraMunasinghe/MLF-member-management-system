import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    purposeType: {
      type: String,
      enum: ["social_welfare", "business"],
      required: true,
    },

    formType: {
      type: String,
      enum: ["type1", "type2"],
      required: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    logo: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);