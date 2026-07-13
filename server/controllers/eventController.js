import Event from "../models/Event.js";
import Organization from "../models/Organization.js";
import Member from "../models/Member.js";
import TitleOrder from "../models/TitleOrder.js";

const getOrganizationTypeFromPurpose = (purposeType) => {
  if (purposeType === "business") return "IBDF";
  if (purposeType === "social_welfare") return "Foundation";
  return undefined;
};

// 1. Create Event
export const createEvent = async (req, res) => {
  try {
    const { name, organizationId, date, description } = req.body;

    const parseCategories = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    };

    const categories = parseCategories(req.body.categories);

    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const organizationType = getOrganizationTypeFromPurpose(
      organization.purposeType
    );

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const event = new Event({
      name,
      organizationType,
      organizationId,
      date,
      description,
      logo,
      categories,
    });

    await event.save();

    res.json({
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Events with member count
export const getEvents = async (req, res) => {
  try {
    const { organizationType, organizationId } = req.query;

    const filter = {};

    if (organizationType) {
      filter.organizationType = organizationType;
    }

    if (organizationId) {
      filter.organizationId = organizationId;
    }

    const events = await Event.find(filter)
      .populate("organizationId")
      .sort({ date: -1, createdAt: -1 });

    const result = await Promise.all(
      events.map(async (event) => {
        const count = await Member.countDocuments({
          eventId: event._id,
          status: "completed",
        });

        return {
          ...event._doc,
          memberCount: count,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "organizationId"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const count = await Member.countDocuments({
      eventId: event._id,
      status: "completed",
    });

    res.json({
      ...event._doc,
      memberCount: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Event
export const updateEvent = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    const parseCategories = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    };

    if (data.name !== undefined) {
      updateFields.name = data.name;
    }

    if (data.date !== undefined) {
      updateFields.date = data.date;
    }

    if (data.description !== undefined) {
      updateFields.description = data.description;
    }

    if (data.organizationId !== undefined) {
      const organization = await Organization.findById(data.organizationId);

      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }

      updateFields.organizationId = data.organizationId;
      updateFields.organizationType = getOrganizationTypeFromPurpose(
        organization.purposeType
      );
    }

    if (data.categories !== undefined) {
      updateFields.categories = parseCategories(data.categories);
    }

    if (req.file) {
      updateFields.logo = `/uploads/${req.file.filename}`;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({
      message: "Event updated successfully",
      updatedEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 5. Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const usedMembers = await Member.countDocuments({
      eventId: req.params.id,
    });

    if (usedMembers > 0) {
      return res.status(400).json({
        message: "Cannot delete event because members are assigned to this event.",
      });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Event Stats
export const getEventStats = async (req, res) => {
  try {
    const count = await Member.countDocuments({
      eventId: req.params.id,
      status: "completed",
    });

    res.json({
      eventId: req.params.id,
      memberCount: count,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
};

// 7. Get members by event and category
export const getEventMembersByCategory = async (req, res) => {
  try {
    const { eventId, category } = req.params;
    const decodedCategory = decodeURIComponent(category);

    const members = await Member.find({
      eventId,
      status: "completed",
      categories: decodedCategory,
    })
      .populate("coordinatorId", "name coordinatorId")
      .populate("organizationId", "name")
      .populate("eventId", "name")
      .sort({ createdAt: 1, _id: 1 });

    // Get every saved title order for this event and category
    const savedTitleOrders = await TitleOrder.find({
      eventId,
      category: decodedCategory,
    }).lean();

    /*
      Creates a structure like:

      {
        "Title A": Map(memberId => order),
        "Title B": Map(memberId => order)
      }
    */
    const titleOrderMap = new Map();

    savedTitleOrders.forEach((titleOrder) => {
      const memberOrderMap = new Map();

      titleOrder.members.forEach((item) => {
        memberOrderMap.set(
          item.memberId.toString(),
          item.order
        );
      });

      titleOrderMap.set(titleOrder.title, memberOrderMap);
    });

    const rows = [];

    members.forEach((member) => {
      const memberObject = member.toObject();
      const memberId = member._id.toString();

      const categoryTitleData = member.categoryTitles?.find(
        (item) => item.category === decodedCategory
      );

      const titles =
        categoryTitleData?.titles
          ?.map((title) =>
            typeof title === "string"
              ? title.trim()
              : ""
          )
          .filter(Boolean) || [];

      titles.forEach((title) => {
        const savedOrder = titleOrderMap
          .get(title)
          ?.get(memberId);

        rows.push({
          ...memberObject,
          memberId: member._id,
          category: decodedCategory,
          title,

          // null means no custom order has been saved yet
          order:
            typeof savedOrder === "number"
              ? savedOrder
              : null,
        });
      });
    });

    /*
      Group rows by title so unsaved members can receive a temporary
      order after the saved members.

      This temporary order is returned to the table but is not written
      to the TitleOrder collection until the admin saves the order.
    */
    const rowsByTitle = new Map();

    rows.forEach((row) => {
      if (!rowsByTitle.has(row.title)) {
        rowsByTitle.set(row.title, []);
      }

      rowsByTitle.get(row.title).push(row);
    });

    const orderedRows = [];

    rowsByTitle.forEach((titleRows, title) => {
      const savedRows = titleRows
        .filter((row) => row.order !== null)
        .sort((a, b) => a.order - b.order);

      const unsavedRows = titleRows.filter(
        (row) => row.order === null
      );

      const highestSavedOrder =
        savedRows.length > 0
          ? Math.max(...savedRows.map((row) => row.order))
          : 0;

      const completedTitleRows = [
        ...savedRows,
        ...unsavedRows.map((row, index) => ({
          ...row,
          order: highestSavedOrder + index + 1,
        })),
      ];

      orderedRows.push(...completedTitleRows);
    });

    res.json({
      eventId,
      category: decodedCategory,
      count: orderedRows.length,
      members: orderedRows,
    });
  } catch (err) {
    console.error(
      "Failed to get event members by category",
      err
    );

    res.status(500).json({
      message: "Failed to get event members by category",
      error: err.message,
    });
  }
};