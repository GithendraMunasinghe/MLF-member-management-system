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

// 2. Get All Coordinators (WITH customer count)
export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await Coordinator.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      coordinators.map(async (coord) => {
        const count = await Member.countDocuments({
          coordinator: coord.coordinatorId,
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
 
// 3. Get Single Coordinator
export const getCoordinatorById = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    const count = await Member.countDocuments({
      coordinator: coordinator.coordinatorId,
    });

    res.json({
      ...coordinator._doc,
      customerCount: count,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Coordinator (Partial Update)
export const updateCoordinator = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    const set = (key) => {
      if (data[key] !== undefined) {
        updateFields[key] = data[key];
      }
    };

    set("name");
    set("coordinatorId");
    set("phoneNumber");

    // Photo update
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
    const deletedCoordinator = await Coordinator.findByIdAndDelete(req.params.id);

    if (!deletedCoordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    res.json({ message: "Coordinator deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get Coordinator Stats (Member Count)
export const getCoordinatorStats = async (req, res) => {
  try {
    const coordinator = await Coordinator.findById(req.params.id);

    if (!coordinator) {
      return res.status(404).json({ message: "Coordinator not found" });
    }

    const count = await Member.countDocuments({
      coordinator: coordinator.coordinatorId //
    });

    res.json({
      coordinatorId: coordinator.coordinatorId,
      memberCount: count
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stats" });
  }
};