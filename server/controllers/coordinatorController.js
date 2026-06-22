import Coordinator from "../models/Coordinator.js";
import Member from "../models/Member.js";

// 1. Create Coordinator
export const createCoordinator = async (req, res) => {
  try {
    const { name, coordinatorId, phoneNumber } = req.body;

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const coordinator = new Coordinator({
      name,
      coordinatorId,
      phoneNumber,
      photo,
    });

    await coordinator.save();

    res.json({
      message: "Coordinator created successfully",
      coordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Coordinators WITH customer count
export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      coordinators.map(async (coord) => {
        const count = await Member.countDocuments({
          coordinatorId: coord._id,
          status: "completed",
        });

        return {
          ...coord._doc,
          customerCount: count,
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Single Coordinator WITH customer count
export const getCoordinatorById = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    const count = await Member.countDocuments({
      coordinatorId: coordinator._id,
      status: "completed",
    });

    res.json({
      ...coordinator._doc,
      customerCount: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Coordinator
export const updateCoordinator = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    if (data.name !== undefined) {
      updateFields.name = data.name;
    }

    if (data.coordinatorId !== undefined) {
      updateFields.coordinatorId = data.coordinatorId;
    }

    if (data.phoneNumber !== undefined) {
      updateFields.phoneNumber = data.phoneNumber;
    }

    if (req.file) {
      updateFields.photo = `/uploads/${req.file.filename}`;
    }

    const updatedCoordinator = await Coordinator.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedCoordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.json({
      message: "Coordinator updated successfully",
      updatedCoordinator,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 5. Delete Coordinator
export const deleteCoordinator = async (req, res) => {
  try {
    const usedMembers = await Member.countDocuments({
      coordinatorId: req.params.id,
    });

    if (usedMembers > 0) {
      return res.status(400).json({
        message: "Cannot delete coordinator because customers are assigned to this coordinator.",
      });
    }

    const deletedCoordinator = await Coordinator.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCoordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.json({ message: "Coordinator deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get Coordinator Stats
export const getCoordinatorStats = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    const count = await Member.countDocuments({
      coordinatorId: coordinator._id,
      status: "completed",
    });

    res.json({
      coordinatorId: coordinator.coordinatorId,
      coordinatorName: coordinator.name,
      customerCount: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stats" });
  }
};
