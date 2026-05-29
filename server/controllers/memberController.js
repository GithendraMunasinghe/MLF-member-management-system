import Member from '../models/Member.js';

// 1. Create a new member
export const createMember = async (req, res) => {
  try {
    const data = req.body;

    const safeParse = (value) => {
      try {
        return value ? JSON.parse(value) : {};
      } catch {
        return {};
      }
    };

    const clean = (value) => {
      return value === "" ? undefined : value;
    };

    const cleanNumber = (value) => {
      return value === "" || value === undefined || value === null
        ? undefined
        : Number(value);
    };

    // Parse nested objects
    const personalInfo = safeParse(data.personalInfo);
    const address = safeParse(data.address);
    const contact = safeParse(data.contact);
    const business = safeParse(data.business);
    const professional = safeParse(data.professional);

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const member = new Member({
      status: data.status || "draft",

      organizationType: clean(data.organizationType),
      formType: clean(data.formType),

      // Relations
      organizationId: clean(data.organizationId),
      eventId: clean(data.eventId),
      coordinatorId: clean(data.coordinatorId),

      regNo: clean(data.regNo),
      photo,

      batchNumber: clean(data.batchNumber),
      registeredYear: clean(data.registeredYear),

      // Personal Info
      personalInfo: {
        fullName: clean(personalInfo.fullName),
        certificateName: clean(personalInfo.certificateName),
        nameWithInitials: clean(personalInfo.nameWithInitials),
        nicNumber: clean(personalInfo.nicNumber),
        passportNumber: clean(personalInfo.passportNumber),
        drivingLicense: clean(personalInfo.drivingLicense),

        // IMPORTANT: enum fields must not be empty string
        gender: clean(personalInfo.gender),
        maritalStatus: clean(personalInfo.maritalStatus),

        dateOfBirth: clean(personalInfo.dateOfBirth),
      },

      // Address
      address: {
        permanentAddress: clean(address.permanentAddress),
        province: clean(address.province),
        district: clean(address.district),
        divisionalSecretariat: clean(address.divisionalSecretariat),
        gramaNiladhariDivision: clean(address.gramaNiladhariDivision),
        policeDivision: clean(address.policeDivision),
      },

      // Contact
      contact: {
        mobilePhone: clean(contact.mobilePhone),
        whatsappNumber: clean(contact.whatsappNumber),
        email: clean(contact.email),
      },

      // Professional
      professional: {
        jobStatus: clean(professional.jobStatus),
        workExperience: clean(professional.workExperience),
        workplaceAddress: clean(professional.workplaceAddress),
      },

      // Business
      business: {
        hasBusiness: business.hasBusiness,
        numberOfBusinesses: cleanNumber(business.numberOfBusinesses),

        name: clean(business.name),
        about: clean(business.about),

        registrationNumber: clean(business.registrationNumber),
        contactNumber: clean(business.contactNumber),
        email: clean(business.email),
        website: clean(business.website),

        startedYear: clean(business.startedYear),
        address: clean(business.address),
        numberOfBranches: cleanNumber(business.numberOfBranches),

        portalName: clean(business.portalName),
        grade: cleanNumber(business.grade),
      },

      organization: {
        title: clean(data.title),
      },
    });

    await member.save();

    res.json({
      message: "Member created successfully",
      member,
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all members
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("organizationId")
      .populate("eventId")
      .populate("coordinatorId")
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get a member by ID
export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate("organizationId")
      .populate("eventId")
      .populate("coordinatorId");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Search members by Registration Number
export const searchMemberByRegNo = async (req, res) => {
  try {
    const member = await Member.findOne({ regNo: req.params.regNo })
      .populate("organizationId")
      .populate("eventId")
      .populate("coordinatorId");

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Update a member by ID (Partial Update)
export const updateMember = async (req, res) => {
  try {
    const data = req.body;
    const updateFields = {};

    // Helper to handle nested fields safely
    const setNested = (objPath, value) => {
      if (value !== undefined) {
        updateFields[objPath] = value;
      }
    };

    // 🔹 Basic Fields
    setNested("formType", data.formType);
    setNested("organizationType", data.organizationType);
    setNested("event", data.event);
    setNested("coordinator", data.coordinator);
    setNested("regNo", data.regNo);
    setNested("batchNumber", data.batchNumber);
    setNested("registeredYear", data.registeredYear);

    // 🔹 Personal Info
    if (data.personalInfo) {
      setNested("personalInfo.fullName", data.personalInfo.fullName);
      setNested("personalInfo.certificateName", data.personalInfo.certificateName);
      setNested("personalInfo.nameWithInitials", data.personalInfo.nameWithInitials);
      setNested("personalInfo.nicNumber", data.personalInfo.nicNumber);
      setNested("personalInfo.passportNumber", data.personalInfo.passportNumber);
      setNested("personalInfo.drivingLicense", data.personalInfo.drivingLicense);
      setNested("personalInfo.gender", data.personalInfo.gender);
      setNested("personalInfo.maritalStatus", data.personalInfo.maritalStatus);
      setNested("personalInfo.dateOfBirth", data.personalInfo.dateOfBirth);
    }

    // 🔹 Address Info
    if (data.address) {
      setNested("address.permanentAddress", data.address.permanentAddress);
      setNested("address.province", data.address.province);
      setNested("address.district", data.address.district);
      setNested("address.divisionalSecretariat", data.address.divisionalSecretariat);
      setNested("address.gramaNiladhariDivision", data.address.gramaNiladhariDivision);
      setNested("address.policeDivision", data.address.policeDivision);
    }

    // 🔹 Contact Info
    if (data.contact) {
      setNested("contact.mobilePhone", data.contact.mobilePhone);
      setNested("contact.whatsappNumber", data.contact.whatsappNumber);
      setNested("contact.email", data.contact.email);
    }

    // 🔹 Professional Info
    if (data.professional) {
      setNested("professional.jobStatus", data.professional.jobStatus);
      setNested("professional.workExperience", data.professional.workExperience);
      setNested("professional.workplaceAddress", data.professional.workplaceAddress);
    }

    // 🔹 Business Info
    if (data.business) {
      setNested("business.hasBusiness", data.business.hasBusiness);
      setNested("business.numberOfBusinesses", data.business.numberOfBusinesses);
      setNested("business.name", data.business.name);
      setNested("business.about", data.business.about);
      setNested("business.registrationNumber", data.business.registrationNumber);
      setNested("business.contactNumber", data.business.contactNumber);
      setNested("business.email", data.business.email);
      setNested("business.website", data.business.website);
      setNested("business.startedYear", data.business.startedYear);
      setNested("business.address", data.business.address);
      setNested("business.numberOfBranches", data.business.numberOfBranches);
      setNested("business.portalName", data.business.portalName);
      setNested("business.grade", data.business.grade);
    }

    // 🔹 Organization Title
    setNested("organization.title", data.title);

    // 🔹 Profile Photo
    if (req.file) {
      setNested("photo", `/uploads/${req.file.filename}`);
    }

    // 🔹 Update the document
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member updated successfully", updatedMember });

  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// 6. Delete a member by ID
export const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7. Get total members count
export const getMembersCount = async (req, res) => {
  try {
    const count = await Member.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 8. Search members by Registration Number & Name
export const searchMembers = async (req, res) => {
  try {
    let query = req.query.q;

    // ✅ Trim input
    query = query?.trim();

    // ✅ If empty → return all
    if (!query) {
      const members = await Member.find().sort({ createdAt: -1 });
      return res.json(members);
    }

    const members = await Member.find({
      $or: [
            { "personalInfo.fullName": { $regex: query, $options: "i" } },
            { regNo: { $regex: query, $options: "i" } },
            { "personalInfo.nicNumber": { $regex: query, $options: "i" } },
            { "contact.mobilePhone": { $regex: query, $options: "i" } }
      ]
    }).sort({ createdAt: -1 });

    res.json(members);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed"});
  }
};

// 9.
export const getDraftMembers = async (req, res) => {
  try {
    const drafts = await Member.find({
      status: "draft",
    }).sort({ updatedAt: -1 });

    res.json(drafts);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};