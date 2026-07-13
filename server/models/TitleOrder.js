import mongoose from "mongoose";

const titleOrderMemberSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const titleOrderSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    members: {
      type: [titleOrderMemberSchema],
      default: [],
    },
  },
  { timestamps: true }
);

titleOrderSchema.index(
  {
    eventId: 1,
    category: 1,
    title: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model("TitleOrder", titleOrderSchema);