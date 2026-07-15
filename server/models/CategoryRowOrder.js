import mongoose from "mongoose";

const categoryRowSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const categoryRowOrderSchema = new mongoose.Schema(
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

    rows: {
      type: [categoryRowSchema],
      default: [],
    },
  },
  { timestamps: true }
);

categoryRowOrderSchema.index(
  {
    eventId: 1,
    category: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "CategoryRowOrder",
  categoryRowOrderSchema
);