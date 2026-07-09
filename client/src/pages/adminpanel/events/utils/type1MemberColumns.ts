import type { Column } from "../components/ReusableMembersTable";

export const type1MemberColumns: Column[] = [
  // Basic
  {
    group: "Basic Information",
    key: "regNo",
    label: "Registration No.",
    width: 150,
    align: "center",
    sticky: true,
  },
  {
    group: "Basic Information",
    key: "category",
    label: "Category",
    width: 180,
    sticky: true,
  },
  {
    group: "Basic Information",
    key: "title",
    label: "Title",
    width: 280,
    sticky: true,
  },
  {
    group: "Basic Information",
    key: "coordinatorId.name",
    label: "Coordinator",
    width: 180,
  },
  {
    group: "Basic Information",
    key: "createdAt",
    label: "Registered Date",
    type: "date",
    width: 150,
    align: "center",
  },

  // Personal
  {
    group: "Personal Information",
    key: "personalInfo.certificateName",
    label: "Certificate Name",
    width: 240,
  },
  {
    group: "Personal Information",
    key: "personalInfo.fullName",
    label: "Full Name",
    width: 280,
  },
  {
    group: "Personal Information",
    key: "personalInfo.nameWithInitials",
    label: "Name with Initials",
    width: 220,
  },
  {
    group: "Personal Information",
    key: "personalInfo.nicNumber",
    label: "NIC Number",
    width: 160,
  },
  {
    group: "Personal Information",
    key: "personalInfo.passportNumber",
    label: "Passport Number",
    width: 170,
  },
  {
    group: "Personal Information",
    key: "personalInfo.drivingLicense",
    label: "Driving License",
    width: 180,
  },
  {
    group: "Personal Information",
    key: "personalInfo.gender",
    label: "Gender",
    width: 120,
    align: "center",
  },
  {
    group: "Personal Information",
    key: "personalInfo.maritalStatus",
    label: "Marital Status",
    width: 150,
    align: "center",
  },
  {
    group: "Personal Information",
    key: "personalInfo.dateOfBirth",
    label: "Date of Birth",
    type: "date",
    width: 150,
    align: "center",
  },

  // Contact
  {
    group: "Contact Information",
    key: "contact.mobilePhone",
    label: "Mobile Phone",
    width: 160,
  },
  {
    group: "Contact Information",
    key: "contact.whatsappNumber",
    label: "WhatsApp Number",
    width: 170,
  },
  {
    group: "Contact Information",
    key: "contact.email",
    label: "Email",
    width: 240,
  },

  // Address
  {
    group: "Address Information",
    key: "address.permanentAddress",
    label: "Permanent Address",
    width: 320,
  },
  {
    group: "Address Information",
    key: "address.province",
    label: "Province",
    width: 150,
  },
  {
    group: "Address Information",
    key: "address.district",
    label: "District",
    width: 150,
  },
  {
    group: "Address Information",
    key: "address.divisionalSecretariat",
    label: "Divisional Secretariat",
    width: 220,
  },
  {
    group: "Address Information",
    key: "address.gramaNiladhariDivision",
    label: "Grama Niladhari Division",
    width: 240,
  },
  {
    group: "Address Information",
    key: "address.policeDivision",
    label: "Police Division",
    width: 190,
  },

  // Professional
  {
    group: "Professional Information",
    key: "professional.jobStatus",
    label: "Job Status",
    width: 180,
  },
  {
    group: "Professional Information",
    key: "professional.workExperience",
    label: "Work Experience",
    width: 200,
  },
  {
    group: "Professional Information",
    key: "professional.workplaceAddress",
    label: "Workplace Address",
    width: 300,
  },
];