import fs from "fs";
import path from "path";
import { ZipArchive } from "archiver";
import Member from "../models/Member.js";

const sanitizeFileName = (value = "") =>
  value
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_");

const getExtension = (photoPath = "") => {
  const extension = path.extname(photoPath).toLowerCase();

  if (extension === ".jpg" || extension === ".jpeg") return ".jpeg";
  if (extension === ".png") return ".png";
  if (extension === ".webp") return ".webp";

  return ".jpeg";
};

export const downloadOrderedMemberPhotos = async (req, res) => {
  try {
    const { eventId, category } = req.params;
    const { rows } = req.body;

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({
        message: "Ordered rows are required.",
      });
    }

    const decodedCategory = decodeURIComponent(category);

    const defaultPhotoPath = path.join(
      process.cwd(),
      "assets",
      "default-member-photo.jpg"
    );

    if (!fs.existsSync(defaultPhotoPath)) {
      return res.status(500).json({
        message: "Default member photo is missing.",
      });
    }

    const memberIds = [
      ...new Set(
        rows
          .map((row) => row?.memberId)
          .filter(Boolean)
      ),
    ];

    const members = await Member.find({
      _id: { $in: memberIds },
      eventId,
      status: "completed",
      categories: decodedCategory,
    }).select("_id photo");

    const memberPhotoMap = new Map(
      members.map((member) => [
        member._id.toString(),
        member.photo,
      ])
    );

    const zipName = `${sanitizeFileName(
      decodedCategory
    )}_Photos.zip`;

    res.setHeader(
      "Content-Type",
      "application/zip"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${zipName}"`
    );

    const archive = new ZipArchive({
      zlib: { level: 9 },
    });

    archive.on("error", (error) => {
      console.error("Archive error", error);

      if (!res.headersSent) {
        res.status(500).json({
          message: "Failed to create photo ZIP.",
          error: error.message,
        });
      } else {
        res.destroy(error);
      }
    });

    archive.pipe(res);

    rows.forEach((row, index) => {
      const memberId = row?.memberId?.toString();
      const storedPhoto = memberPhotoMap.get(memberId);

      const orderNumber =
        Number(row.order) || index + 1;

      const paddedOrder = String(orderNumber).padStart(
        Math.max(3, String(rows.length).length),
        "0"
      );

      let photoPath = defaultPhotoPath;
      let extension = ".jpeg";

      if (storedPhoto) {
        const storedPhotoPath = path.join(
          process.cwd(),
          storedPhoto.replace(/^\/+/, "")
        );

        if (fs.existsSync(storedPhotoPath)) {
          photoPath = storedPhotoPath;
          extension = getExtension(storedPhoto);
        }
      }

      archive.file(photoPath, {
        name: `${paddedOrder}${extension}`,
      });
    });

    await archive.finalize();
  } catch (err) {
    console.error(
      "Failed to download ordered photos",
      err
    );

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to create photo ZIP.",
        error: err.message,
      });
    }
  }
};