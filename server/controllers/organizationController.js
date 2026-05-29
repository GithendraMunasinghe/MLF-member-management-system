import Organization from "../models/Organization.js";
import Member from "../models/Member.js";

// 1. Create Organization
export const createOrganization = async (req, res) => {
  try {
    const { name, registrationNumber } = req.body;

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const organization = new Organization({
      name,
      registrationNumber,
      logo,
    });

    await organization.save();

    res.json({
      message: "Organization created successfully",
      organization,
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};


// 2. Get All Organizations (WITH member count)
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      organizations.map(async (org) => {
        const count = await Member.countDocuments({
          organizationType: org.name, // 🔥 match with member model
        });

        return {
          ...org._doc,
          memberCount: count,
        };
      })
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Single Organization (WITH member count)
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const count = await Member.countDocuments({
      organizationType: organization.name,
    });

    res.json({
      ...organization._doc,
      memberCount: count,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Organization (Partial Update)
export const updateOrganization = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    const set = (key) => {
      if (data[key] !== undefined) {
        updateFields[key] = data[key];
      }
    };

    set("name");
    set("registrationNumber");

    // Logo update
    if (req.file) {
      updateFields.logo = `/uploads/${req.file.filename}`;
    }

    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({
      message: "Organization updated successfully",
      updatedOrganization,
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 5.Delete Organization
export const deleteOrganization = async (req, res) => {
  try {
    const deletedOrganization = await Organization.findByIdAndDelete(req.params.id);

    if (!deletedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({ message: "Organization deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get Organization Stats (Member Count)
export const getOrganizationStats = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const count = await Member.countDocuments({
      organizationType: organization.name,
    });

    res.json({
      organization: organization.name,
      memberCount: count,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stats" });
  }
};