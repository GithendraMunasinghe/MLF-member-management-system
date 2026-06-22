import Organization from "../models/Organization.js";
import Member from "../models/Member.js";

const getFormTypeFromPurpose = (purposeType) => {
  if (purposeType === "business") return "type2";
  if (purposeType === "social_welfare") return "type1";
  return undefined;
};

// 1. Create Organization
export const createOrganization = async (req, res) => {
  try {
    const { name, purposeType, registrationNumber } = req.body;

    const formType = getFormTypeFromPurpose(purposeType);

    if (!formType) {
      return res.status(400).json({
        error: "Invalid purpose type",
      });
    }

    const logo = req.file ? `/uploads/${req.file.filename}` : null;

    const organization = new Organization({
      name,
      purposeType,
      formType,
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

// 2. Get All Organizations
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });

    const result = await Promise.all(
      organizations.map(async (org) => {
        const count = await Member.countDocuments({
          organizationId: org._id,
          status: "completed",
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

// 3. Get Single Organization
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const count = await Member.countDocuments({
      organizationId: organization._id,
      status: "completed",
    });

    res.json({
      ...organization._doc,
      memberCount: count,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Organization
export const updateOrganization = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    if (data.name !== undefined) {
      updateFields.name = data.name;
    }

    if (data.registrationNumber !== undefined) {
      updateFields.registrationNumber = data.registrationNumber;
    }

    if (data.purposeType !== undefined) {
      const formType = getFormTypeFromPurpose(data.purposeType);

      if (!formType) {
        return res.status(400).json({
          error: "Invalid purpose type",
        });
      }

      updateFields.purposeType = data.purposeType;
      updateFields.formType = formType;
    }

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

// 5. Delete Organization
export const deleteOrganization = async (req, res) => {
  try {
    const usedMembers = await Member.countDocuments({
      organizationId: req.params.id,
    });

    if (usedMembers > 0) {
      return res.status(400).json({
        message: "Cannot delete organization because members are assigned to it.",
      });
    }

    const deletedOrganization = await Organization.findByIdAndDelete(
      req.params.id
    );

    if (!deletedOrganization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.json({ message: "Organization deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 6. Get Organization Stats
export const getOrganizationStats = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const count = await Member.countDocuments({
      organizationId: organization._id,
      status: "completed",
    });

    res.json({
      organization: organization.name,
      purposeType: organization.purposeType,
      formType: organization.formType,
      memberCount: count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get stats" });
  }
};