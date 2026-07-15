import mongoose from "mongoose";
import Member from "../models/Member.js";
import CategoryRowOrder from "../models/CategoryRowOrder.js";

const normalizeRows = (rows = []) => {
  if (!Array.isArray(rows)) {
    return [];
  }

  const seenRows = new Set();

  return rows
    .map((row, index) => {
      const memberId = row?.memberId?.toString();
      const title =
        typeof row?.title === "string"
          ? row.title.trim()
          : "";

      if (
        !memberId ||
        !mongoose.Types.ObjectId.isValid(memberId) ||
        !title
      ) {
        return null;
      }

      // Allows the same member in the table more than once,
      // but prevents duplicate member + title rows.
      const uniqueRowKey = `${memberId}::${title}`;

      if (seenRows.has(uniqueRowKey)) {
        return null;
      }

      seenRows.add(uniqueRowKey);

      return {
        memberId,
        title,
        order: index + 1,
      };
    })
    .filter(Boolean);
};

// GET the saved row order for one event + category
export const getCategoryRowOrder = async (req, res) => {
  try {
    const { eventId, category } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID.",
      });
    }

    const decodedCategory = decodeURIComponent(category);

    const savedOrder = await CategoryRowOrder.findOne({
      eventId,
      category: decodedCategory,
    }).lean();

    res.json({
      eventId,
      category: decodedCategory,
      rows: savedOrder?.rows || [],
    });
  } catch (err) {
    console.error("Failed to get category row order", err);

    res.status(500).json({
      message: "Failed to get category row order.",
      error: err.message,
    });
  }
};

// PUT the full visible row order for one event + category
export const saveCategoryRowOrder = async (req, res) => {
  try {
    const { eventId, category } = req.params;
    const { rows } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID.",
      });
    }

    if (!Array.isArray(rows)) {
      return res.status(400).json({
        message: "Rows must be provided as an array.",
      });
    }

    const decodedCategory = decodeURIComponent(category);
    const normalizedRows = normalizeRows(rows);

    const memberIds = [
      ...new Set(
        normalizedRows.map((row) => row.memberId)
      ),
    ];

    const validMembers = await Member.find({
      _id: { $in: memberIds },
      eventId,
      status: "completed",
      categories: decodedCategory,
    }).select("_id categoryTitles");

    const validMemberMap = new Map(
      validMembers.map((member) => [
        member._id.toString(),
        member,
      ])
    );

    const invalidRows = normalizedRows.filter((row) => {
      const member = validMemberMap.get(row.memberId);

      if (!member) {
        return true;
      }

      const categoryTitleData =
        member.categoryTitles?.find(
          (item) => item.category === decodedCategory
        );

      return !categoryTitleData?.titles?.includes(row.title);
    });

    if (invalidRows.length > 0) {
      return res.status(400).json({
        message:
          "Some rows do not belong to the selected event, category, or title.",
        invalidRows,
      });
    }

    const updatedOrder =
      await CategoryRowOrder.findOneAndUpdate(
        {
          eventId,
          category: decodedCategory,
        },
        {
          $set: {
            rows: normalizedRows,
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
      message: "Category row order saved successfully.",
      categoryRowOrder: updatedOrder,
    });
  } catch (err) {
    console.error("Failed to save category row order", err);

    res.status(500).json({
      message: "Failed to save category row order.",
      error: err.message,
    });
  }
};