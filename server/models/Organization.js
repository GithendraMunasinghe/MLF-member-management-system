import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      enum: ["Foundation", "IBDF"], // fixed predefined orgs
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    logo: {
      type: String, // /uploads/logo.png
    },

    // member count will be calculated dynamically from Member collection
  },
  { timestamps: true }
);

export default mongoose.model("Organization", organizationSchema);