import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import DatePickerInput from "@/components/adminpanel/inputs/DatePickerInput";
import FileUpload from "@/components/adminpanel/inputs/FileUpload";

import { provinceDistrictMap } from "@/data/locationData";

export default function AddMemberPage() {

  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    organizationId: "",
    organizationType: "",
    formType: "type1",

    eventId: "",
    coordinatorId: "",

    regNo: "",
    batchNumber: "",
    registeredYear: "",

    personalInfo: {
      fullName: "",
      certificateName: "",
      nameWithInitials: "",
      nicNumber: "",
      passportNumber: "",
      drivingLicense: "",
      gender: "",
      maritalStatus: "",
      dateOfBirth: "",
    },

    contact: {
      mobilePhone: "",
      whatsappNumber: "",
      email: "",
    },

    address: {
      permanentAddress: "",
      province: "",
      district: "",
      divisionalSecretariat: "",
      gramaNiladhariDivision: "",
      policeDivision: "",
    },

    business: {
      name: "",
      about: "",
      registrationNumber: "",
      contactNumber: "",
      email: "",
      website: "",
      startedYear: "",
      address: "",
      numberOfBranches: "",
      portalName: "",
      grade: "",
    },

    professional: {
      jobStatus: "",
      workExperience: "",
      workplaceAddress: "",
    },

    photo: null,
  });

  const [draftId, setDraftId] = useState<string | null>(null);

  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState<"type1" | "type2">("type1");

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [coordinators, setCoordinators] = useState<any[]>([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Updated step count
  const totalSteps = formType === "type2" ? 6 : 5;


  // Utility to format values based on field type
  const formatValue = (field: string, value: any) => {
    if (typeof value !== "string") return value;

    const emailFields = ["email", "businessEmail"];

    if (emailFields.includes(field)) {
      return value.toLowerCase();
    }

    return value.toUpperCase();
  };

   // Helper function to update form data
  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: formatValue(String(field), value),
    }));
  };

  const updateNestedField = (
    section: string,
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: formatValue(field, value),
      },
    }));
  };

  //payload structure for submission
  const buildPayload = () => {
    return {
      organizationId: formData.organizationId,
      organizationType: formData.organizationType,
      formType: formType,

      eventId: formData.eventId,
      coordinatorId: formData.coordinatorId,

      regNo: formData.regNo,
      batchNumber: formType === "type2" ? formData.batchNumber : undefined,
      registeredYear: formType === "type2" ? formData.registeredYear : undefined,

      personalInfo: {
        ...formData.personalInfo,
        dateOfBirth: formData.personalInfo.dateOfBirth || null,
      },

      contact: {
        mobilePhone: formData.contact.mobilePhone,
        whatsappNumber: formData.contact.whatsappNumber,
        email: formType === "type2" ? formData.contact.email : undefined,
      },

      address: {
        ...formData.address,
        policeDivision: formType === "type2" ? formData.address.policeDivision : undefined,
      },

      business:
        formType === "type2"
          ? {
              ...formData.business,
              grade: formData.business.grade ? Number(formData.business.grade) : undefined,
            }
          : undefined,

      professional: formType === "type1" ? formData.professional : undefined,
    };
  };

// For handling file uploads, you might want to use FormData instead of JSON

const [loading, setLoading] = useState(false);

const validateStep = () => {
  if (step === 1) {
    if (!formData.organizationId) return "Please select an organization.";
    if (!formData.eventId) return "Please select an event.";
    if (!formData.coordinatorId) return "Please select a coordinator.";
    if (!formData.regNo.trim()) return "Please enter registration number.";
  }

  if (step === 2) {
    if (!formData.personalInfo.fullName.trim()) return "Please enter full name.";

    const hasAnyIdentity =
      formData.personalInfo.nicNumber.trim() ||
      formData.personalInfo.passportNumber.trim() ||
      formData.personalInfo.drivingLicense.trim();

    if (!hasAnyIdentity) {
      return "Please enter at least one identity number: NIC, Passport Number, or Driving License.";
    }

    if (!formData.personalInfo.gender) return "Please select gender.";
    if (!formData.personalInfo.maritalStatus) return "Please select marital status.";
  }

  if (step === 3) {
    if (!formData.contact.mobilePhone.trim()) return "Please enter mobile phone number.";
    if (!formData.contact.whatsappNumber.trim()) return "Please enter WhatsApp number.";
  }

  if (step === 4) {
    if (!formData.address.permanentAddress.trim()) return "Please enter permanent address.";
    if (!formData.address.province) return "Please select province.";
    if (!formData.address.district) return "Please select district.";
  }

  return "";
};

const handleNext = () => {
  const error = validateStep();

  if (error) {
    toast({
      title: "Missing information",
      description: error,
      variant: "destructive",
    });
    return;
  }

  nextStep();
};

const saveDraft = async () => {
  try {
    // Prevent empty draft creation
    if (
      !formData.organizationId &&
      !formData.regNo &&
      !formData.personalInfo.fullName
    ) {
      return;
    }

    console.log("AUTO SAVING DRAFT...");

    const payload = buildPayload();

    const formDataToSend = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    formDataToSend.append("status", "draft");

    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    // CREATE NEW DRAFT
    if (!draftId) {
      const res = await fetch("http://localhost:5000/api/members", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      console.log("DRAFT CREATE RESPONSE:", data);

      if (res.ok) {
        setDraftId(data.member._id);
        console.log("Draft created successfully:", data.member._id);
      } else {
        console.error("Draft creation failed:", data);
      }
    }

    // UPDATE EXISTING DRAFT
    else {
      const res = await fetch(`http://localhost:5000/api/members/${draftId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();

      console.log("DRAFT UPDATE RESPONSE:", data);

      if (res.ok) {
        console.log("Draft updated successfully");
      } else {
        console.error("Draft update failed:", data);
      }
    }
  } catch (err) {
    console.error("Draft save failed", err);
  }
};

const handleSubmit = async () => {
  try {
    setLoading(true);

    const payload = buildPayload();

    console.log("FINAL PAYLOAD BEFORE SEND:", payload);

    const formDataToSend = new FormData();

    // Append all fields
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    // Final submit status
    formDataToSend.append("status", "completed");

    // Append photo separately
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }

    const url = draftId
      ? `http://localhost:5000/api/members/${draftId}`
      : "http://localhost:5000/api/members";

    const method = draftId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataToSend,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("FULL BACKEND ERROR:", data);
      console.log("FINAL PAYLOAD:", payload);

      throw new Error(data.error || data.message || "Something went wrong");
    }

    toast({
      title: "Success",
      description: "Member registration completed successfully.",
      variant: "success",
    });

    navigate("/admin-dashboard/members");

  } catch (error: any) {
    console.error(error);

    toast({
      title: "Failed to create member",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const interval = setInterval(() => {
    saveDraft();
  }, 5000);

  return () => clearInterval(interval);
}, [formData, draftId]);

useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const orgRes = await axios.get("http://localhost:5000/api/organizations");
      const coordinatorRes = await axios.get("http://localhost:5000/api/coordinators");

      setOrganizations(orgRes.data);
      setCoordinators(coordinatorRes.data);
    } catch (err) {
      console.error("Error fetching initial data", err);
    }
  };

  fetchInitialData();
}, []);

useEffect(() => {
  const fetchEventsByOrganization = async () => {
    if (!formData.organizationId) {
      setEvents([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/api/events?organizationId=${formData.organizationId}`
      );

      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  fetchEventsByOrganization();
}, [formData.organizationId]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-gray-200">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-700">
          Add New Member
        </h1>

        {/* Progress */}
        <div className="flex items-center gap-2 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${
                i + 1 <= step ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1">

        {/* STEP 1 — BASIC */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <SelectInput
                label="Organization *"
                options={organizations.map((org) => ({
                  label: org.name,
                  value: org._id,
                }))}
                onChange={(value: string) => {
                  const selectedOrg = organizations.find((org) => org._id === value);

                  updateField("organizationId", value);
                  updateField("organizationType", selectedOrg?.name || "");
                  updateField("eventId", "");

                  const selectedFormType = selectedOrg?.name === "IBDF" ? "type2" : "type1";
                  setFormType(selectedFormType);
                  updateField("formType", selectedFormType);
                }}
              />

              <SelectInput
                label="Event *"
                options={events.map((e) => ({
                  label: e.name,
                  value: e._id,
                }))}
                onChange={(val) => updateField("eventId", val)}
                disabled={!formData.organizationId}
              />

              <SelectInput
                label="Coordinator *"
                options={coordinators.map((c) => ({
                  label: c.name,
                  value: c._id,
                }))}
                onChange={(val) => updateField("coordinatorId", val)}
              />

              <TextInput
                label="Registration Number *"
                onChange={(val) => updateField("regNo", val)}
              />

              {formType === "type2" && (
                <>
                  <TextInput
                    label="Batch Number *"
                    onChange={(val) => updateField("batchNumber", val)}
                  />
                  <TextInput
                    label="Registered Year *"
                    onChange={(val) => updateField("registeredYear", val)}
                  />
                </>
              )}

            </div>
          </>
        )}

        {/* STEP 2 — PERSONAL */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <TextInput
              label="Full Name *"
              onChange={(val) => updateNestedField("personalInfo", "fullName", val)}
            />

            <TextInput
              label="Certificate Name *"
              onChange={(val) => updateNestedField("personalInfo", "certificateName", val)}
            />

            <TextInput
              label="Name with Initials"
              onChange={(val) => updateNestedField("personalInfo", "nameWithInitials", val)}
            />

            <p className="md:col-span-2 text-sm text-gray-900">
              Enter at least one: NIC Number, Passport Number, or Driving License.
            </p>

            <TextInput
              label="NIC Number *"
              onChange={(val) => updateNestedField("personalInfo", "nicNumber", val)}
            />

            <TextInput
              label="Passport Number *"
              onChange={(val) => updateNestedField("personalInfo", "passportNumber", val)}
            />

            <TextInput
              label="Driving License *"
              onChange={(val) => updateNestedField("personalInfo", "drivingLicense", val)}
            />

            <SelectInput
              label="Gender *"
              options={["male", "female", "other"]}
              onChange={(val) => updateNestedField("personalInfo", "gender", val)}
            />

            <SelectInput
              label="Marital Status"
              options={["single", "married", "other"]}
              onChange={(val) => updateNestedField("personalInfo", "maritalStatus", val)}
            />

            <DatePickerInput
              label="Date of Birth"
              onChange={(val) => updateNestedField("personalInfo", "dateOfBirth", val)}
            />

            </div>
          </>
        )}

        {/* STEP 3 — CONTACT */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <TextInput
                label="Mobile Phone Number *"
                onChange={(val) => updateNestedField("contact", "mobilePhone", val)}
              />

              <TextInput
                label="WhatsApp Number *"
                onChange={(val) => updateNestedField("contact", "whatsappNumber", val)}
              />

              {formType === "type2" && (
                <TextInput
                  label="Email"
                  onChange={(val) => updateNestedField("contact", "email", val)}
                />
              )}

            </div>
          </>
        )}

        {/* STEP 4 — ADDRESS */}
        {step === 4 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Address</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <TextInput
                  label="Permanent Address *"
                  onChange={(val) => updateNestedField("address", "permanentAddress", val)}
                />

                <SelectInput
                  label="Province *"
                  options={Object.keys(provinceDistrictMap)}
                  onChange={(value: string) => {
                    setProvince(value);
                    setDistrict("");

                    updateNestedField("address", "province", value);
                  }}
                />

                <SelectInput
                  label="District *"
                  options={province ? provinceDistrictMap[province] : []}
                  disabled={!province}
                  onChange={(value: string) => {
                    setDistrict(value);
                    updateNestedField("address", "district", value);
                  }}
                />

                <TextInput
                  label="Divisional Secretariat *"
                  onChange={(val) =>
                    updateNestedField("address", "divisionalSecretariat", val)
                  }
                />

                <TextInput
                  label="Grama Niladhari Division *"
                  onChange={(val) =>
                    updateNestedField("address", "gramaNiladhariDivision", val)
                  }
                />

                {formType === "type2" && (
                  <TextInput
                    label="Police Division *"
                    onChange={(val) =>
                      updateNestedField("address", "policeDivision", val)
                    }
                  />
                )}

            </div>
          </>
        )}

        {/* STEP 5 — BUSINESS / PROFESSIONAL */}
        {step === 5 && (
          <>
            {formType === "type2" ? (
              <>
                <h2 className="text-lg font-semibold mb-4">Business Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <TextInput label="Business Name *" onChange={(v)=>updateNestedField("business","name",v)} />
                  <TextInput label="About Business" onChange={(v)=>updateNestedField("business","about",v)} />
                  <TextInput label="Registration Number *" onChange={(v)=>updateNestedField("business","registrationNumber",v)} />
                  <TextInput label="Contact Number *" onChange={(v)=>updateNestedField("business","contactNumber",v)} />
                  <TextInput label="Business Email" onChange={(v) => updateNestedField("business", "email", v)} />
                  <TextInput label="Website" onChange={(v)=>updateNestedField("business","website",v)} />
                  <TextInput label="Started Year" onChange={(v)=>updateNestedField("business","startedYear",v)} />
                  <TextInput label="Business Address" onChange={(v)=>updateNestedField("business","address",v)} />
                  <TextInput label="Number of Branches" onChange={(v)=>updateNestedField("business","numberOfBranches",v)} />
                  <TextInput label="Portal Name" onChange={(v)=>updateNestedField("business","portalName",v)} />

                  <SelectInput
                    label="Grade *"
                    options={["0","1","2","3","4","5","6","7","8","9","10"]}
                    onChange={(v)=>updateNestedField("business","grade",v)}
                  />

                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-4">Professional Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <TextInput label="Job Status *" onChange={(v)=>updateNestedField("professional","jobStatus",v)} />
                  <TextInput label="Work Experience *" onChange={(v)=>updateNestedField("professional","workExperience",v)} />
                  <TextInput label="Workplace Address *" onChange={(v)=>updateNestedField("professional","workplaceAddress",v)} />

                </div>
              </>
            )}
          </>
        )}

        {/* STEP FINAL */}
        {step === totalSteps && (
          <>
            <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>
            <FileUpload
              label="Upload Profile Photo"
              onChange={(file) => updateField("photo", file)}
            />
          </>
        )}

      </div>

      {/* ACTIONS */}
      <div className="flex justify-between mt-6">

        <Button
          variant="outline"
          onClick={step === 1 ? () => navigate(-1) : prevStep}
        >
          {step === 1 ? "Cancel" : "Back"}
        </Button>

        {step < totalSteps ? (
          <Button
            className="bg-blue-600 text-white"
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <Button
            className="bg-green-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Member"}
          </Button>
        )}

      </div>
    </div>
  );
}