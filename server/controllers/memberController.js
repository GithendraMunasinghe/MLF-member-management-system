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

    const safeParseArray = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
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

    // Parse categories array
    const categories = safeParseArray(data.categories);

    const photo = req.file ? `/uploads/${req.file.filename}` : null;

    const member = new Member({
      status: data.status || "draft",

      organizationType: clean(data.organizationType),
      formType: clean(data.formType),

      // Relations
      organizationId: clean(data.organizationId),
      eventId: clean(data.eventId),
      coordinatorId: clean(data.coordinatorId),

      // Categories selected under selected event
      categories,

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

// 2. Get all completed members only
export const getMembers = async (req, res) => {
  try {
    const members = await Member.find({ status: "completed" })
      .populate("organizationId", "name")
      .populate("eventId", "name")
      .populate("coordinatorId", "name coordinatorId")
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

    const safeParse = (value) => {
      try {
        return value ? JSON.parse(value) : {};
      } catch {
        return {};
      }
    };

    const safeParseArray = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
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

    const personalInfo = safeParse(data.personalInfo);
    const address = safeParse(data.address);
    const contact = safeParse(data.contact);
    const business = safeParse(data.business);
    const professional = safeParse(data.professional);

    const categories = safeParseArray(data.categories);

    const setNested = (objPath, value) => {
      if (value !== undefined) {
        updateFields[objPath] = value;
      }
    };

    // Basic Fields
    setNested("status", clean(data.status));
    setNested("formType", clean(data.formType));
    setNested("organizationType", clean(data.organizationType));

    setNested("organizationId", clean(data.organizationId));
    setNested("eventId", clean(data.eventId));
    setNested("coordinatorId", clean(data.coordinatorId));

    // Categories selected under selected event
    if (data.categories !== undefined) {
      setNested("categories", categories);
    }

    setNested("regNo", clean(data.regNo));
    setNested("batchNumber", clean(data.batchNumber));
    setNested("registeredYear", clean(data.registeredYear));

    // Personal Info
    setNested("personalInfo.fullName", clean(personalInfo.fullName));
    setNested("personalInfo.certificateName", clean(personalInfo.certificateName));
    setNested("personalInfo.nameWithInitials", clean(personalInfo.nameWithInitials));
    setNested("personalInfo.nicNumber", clean(personalInfo.nicNumber));
    setNested("personalInfo.passportNumber", clean(personalInfo.passportNumber));
    setNested("personalInfo.drivingLicense", clean(personalInfo.drivingLicense));
    setNested("personalInfo.gender", clean(personalInfo.gender));
    setNested("personalInfo.maritalStatus", clean(personalInfo.maritalStatus));
    setNested("personalInfo.dateOfBirth", clean(personalInfo.dateOfBirth));

    // Address Info
    setNested("address.permanentAddress", clean(address.permanentAddress));
    setNested("address.province", clean(address.province));
    setNested("address.district", clean(address.district));
    setNested("address.divisionalSecretariat", clean(address.divisionalSecretariat));
    setNested("address.gramaNiladhariDivision", clean(address.gramaNiladhariDivision));
    setNested("address.policeDivision", clean(address.policeDivision));

    // Contact Info
    setNested("contact.mobilePhone", clean(contact.mobilePhone));
    setNested("contact.whatsappNumber", clean(contact.whatsappNumber));
    setNested("contact.email", clean(contact.email));

    // Professional Info
    setNested("professional.jobStatus", clean(professional.jobStatus));
    setNested("professional.workExperience", clean(professional.workExperience));
    setNested("professional.workplaceAddress", clean(professional.workplaceAddress));

    // Business Info
    setNested("business.hasBusiness", business.hasBusiness);
    setNested("business.numberOfBusinesses", cleanNumber(business.numberOfBusinesses));
    setNested("business.name", clean(business.name));
    setNested("business.about", clean(business.about));
    setNested("business.registrationNumber", clean(business.registrationNumber));
    setNested("business.contactNumber", clean(business.contactNumber));
    setNested("business.email", clean(business.email));
    setNested("business.website", clean(business.website));
    setNested("business.startedYear", clean(business.startedYear));
    setNested("business.address", clean(business.address));
    setNested("business.numberOfBranches", cleanNumber(business.numberOfBranches));
    setNested("business.portalName", clean(business.portalName));
    setNested("business.grade", cleanNumber(business.grade));

    if (req.file) {
      setNested("photo", `/uploads/${req.file.filename}`);
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({
      message: "Member updated successfully",
      updatedMember,
    });
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

    // Trim input
    query = query?.trim();

    // If empty → return all
  if (!query) {
    const members = await Member.find({ status: "completed" }).sort({ createdAt: -1 });
    return res.json(members);
  }

    const members = await Member.find({
      status: "completed",
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