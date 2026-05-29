import Event from "../models/Event.js";
import Member from "../models/Member.js";

// 1. Create Event
export const createEvent = async (req, res) => {
  try {
    const { name, organizationType, organizationId, date, description } = req.body;

    // Handle file upload
    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const event = new Event({
      name,
      organizationType,
      organizationId,
      date,
      description,
      logo,
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

// 2. Get All Events (with optional filter)
export const getEvents = async (req, res) => {
  try {
    const { organizationType, organizationId } = req.query;

    let filter = {};

    // Filter by organization type (Foundation / IBDF)
    if (organizationType) {
      filter.organizationType = organizationType;
    }

    // NEW: Filter by organizationId (IMPORTANT)
    if (organizationId) {
      filter.organizationId = organizationId;
    }

    const events = await Event.find(filter).sort({ createdAt: -1 });

    res.json(events);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Event
export const updateEvent = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    // Only update provided fields
    if (data.name) updateFields.name = data.name;
    if (data.organizationType) updateFields.organizationType = data.organizationType;
    if (data.date) updateFields.date = data.date;
    if (data.description) updateFields.description = data.description;

    // Handle logo upload
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
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Event Stats (optional)
export const getEventStats = async (req, res) => {
  try {
    const count = await Member.countDocuments({
      eventId: req.params.id,
    });

    res.json({
      eventId: req.params.id,
      memberCount: count,
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to get stats" });
  }
};