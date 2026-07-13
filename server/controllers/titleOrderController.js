import mongoose from "mongoose";
import Member from "../models/Member.js";
import TitleOrder from "../models/TitleOrder.js";

const normalizeTitleRows = (rows = []) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const seenMemberIds = new Set();

  return rows
    .map((row, index) => {
      const memberId = row?.memberId?.toString();

      if (
        !memberId ||
        !mongoose.Types.ObjectId.isValid(memberId) ||
        seenMemberIds.has(memberId)
      ) {
        return null;
      }

      seenMemberIds.add(memberId);

      return {
        memberId,
        order: index + 1,
      };
    })
    .filter(Boolean);
};

// Get the saved order for one event/category/title
export const getTitleOrder = async (req, res) => {
  try {
    const { eventId, category, title } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID.",
      });
    }

    const decodedCategory = decodeURIComponent(category);
    const decodedTitle = decodeURIComponent(title);

    const savedOrder = await TitleOrder.findOne({
      eventId,
      category: decodedCategory,
      title: decodedTitle,
    }).lean();

    res.json({
      eventId,
      category: decodedCategory,
      title: decodedTitle,
      members: savedOrder?.members || [],
    });
  } catch (err) {
    console.error("Failed to get title order", err);

    res.status(500).json({
      message: "Failed to get title order.",
      error: err.message,
    });
  }
};

// Save the full order for one event/category/title
export const saveTitleOrder = async (req, res) => {
  try {
    const { eventId, category, title } = req.params;
    const { members } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID.",
      });
    }

    if (!Array.isArray(members)) {
      return res.status(400).json({
        message: "Members must be provided as an array.",
      });
    }

    const decodedCategory = decodeURIComponent(category);
    const decodedTitle = decodeURIComponent(title);
    const normalizedMembers = normalizeTitleRows(members);

    const memberIds = normalizedMembers.map((item) => item.memberId);

    const validMembers = await Member.find({
      _id: { $in: memberIds },
      eventId,
      status: "completed",
      categories: decodedCategory,
      categoryTitles: {
        $elemMatch: {
          category: decodedCategory,
          titles: decodedTitle,
        },
      },
    }).select("_id");

    const validMemberIdSet = new Set(
      validMembers.map((member) => member._id.toString())
    );

    const invalidMemberIds = memberIds.filter(
      (memberId) => !validMemberIdSet.has(memberId)
    );

    if (invalidMemberIds.length > 0) {
      return res.status(400).json({
        message:
          "Some members do not belong to the selected event, category, or title.",
        invalidMemberIds,
      });
    }

    const updatedTitleOrder = await TitleOrder.findOneAndUpdate(
      {
        eventId,
        category: decodedCategory,
        title: decodedTitle,
      },
      {
        $set: {
          members: normalizedMembers,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({
      message: "Title order saved successfully.",
      titleOrder: updatedTitleOrder,
    });
  } catch (err) {
    console.error("Failed to save title order", err);

    res.status(500).json({
      message: "Failed to save title order.",
      error: err.message,
    });
  }
};