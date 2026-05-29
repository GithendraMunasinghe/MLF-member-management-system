import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    // Draft / Completed
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },

    // Organization
    organizationType: {
      type: String,
      enum: ["Foundation", "IBDF"],
    },

    // Form Type
    formType: {
      type: String,
      enum: ["type1", "type2"],
    },

    // Event
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },

    // Registration
    regNo: {
      type: String,
      unique: true,
      sparse: true, // IMPORTANT for drafts
      trim: true,
    },

    // Photo
    photo: String,

    // Type 2 Only
    batchNumber: String,
    registeredYear: String,

    // Personal Information
    personalInfo: {
      fullName: String,

      certificateName: String,

      nameWithInitials: String,

      nicNumber: String,

      passportNumber: String,

      drivingLicense: String,

      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },

      maritalStatus: {
        type: String,
        enum: ["single", "married", "other"],
      },

      dateOfBirth: Date,
    },

    // Address Information
    address: {
      permanentAddress: String,

      province: String,

      district: String,

      divisionalSecretariat: String,

      gramaNiladhariDivision: String,

      policeDivision: String,
    },

    // Contact Information
    contact: {
      mobilePhone: String,

      whatsappNumber: String,

      email: String,
    },

    // Professional (Foundation)
    professional: {
      jobStatus: String,

      workExperience: String,

      workplaceAddress: String,
    },

    // Business (IBDF)
    business: {
      hasBusiness: Boolean,

      numberOfBusinesses: Number,

      name: String,

      about: String,

      registrationNumber: String,

      contactNumber: String,

      email: String,

      website: String,

      startedYear: String,

      address: String,

      numberOfBranches: Number,

      portalName: String,

      grade: {
        type: Number,
        min: 0,
        max: 10,
      },
    },

    // Organization Relation
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },

    // Coordinator Relation
    coordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coordinator",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);