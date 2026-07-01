import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { validateMemberStep } from "./utils/memberValidation";
import { buildMemberPayload, createMemberFormData, } from "./utils/memberPayload";
import useMemberDraft from "./hooks/useMemberDraft";
import useMemberData from "./hooks/useMemberData";

import BasicInfoStep from "@/pages/adminpanel/members/components/BasicInfoStep";
import PersonalInfoStep from "./components/PersonalInfoStep";
import ContactInfoStep from "./components/ContactInfoStep";
import AddressStep from "./components/AddressStep";
import BusinessInfoStep from "./components/BusinessInfoStep";
import ProfessionalInfoStep from "./components/ProfessionalInfoStep";
import PhotoStep from "./components/PhotoStep";

export default function AddMemberPage() {

  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    organizationId: "",
    organizationType: "",
    formType: "type1",

    eventId: "",

    categories: [],

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

  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState<"type1" | "type2">("type1");

  const {draftId, setDraftId, saveDraft} = useMemberDraft(token, formData, formType);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");

  const {organizations, events, coordinators} = useMemberData({id, token, formData, setFormData, setDraftId, setFormType, setProvince, setDistrict, toast });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  // Updated step count
  const totalSteps = formType === "type2" ? 6 : 5;

   // Helper function to update form data
  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
        [field]: value,
      },
    }));
  };

// For handling file uploads, you might want to use FormData instead of JSON

const [loading, setLoading] = useState(false);

const handleNext = () => {
  const error = validateMemberStep(step, formData);

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

const handleSubmit = async () => {
  try {
    setLoading(true);

    const payload = buildMemberPayload(formData, formType);

    console.log("FINAL PAYLOAD BEFORE SEND:", payload);

    const formDataToSend = createMemberFormData(
      payload,
      "completed",
      formData.photo
    );

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
  console.log("FORM DATA CHANGED:", formData);
}, [formData]);

useEffect(() => {
  const interval = setInterval(() => {
    saveDraft();
  }, 5000);

  return () => clearInterval(interval);
}, [formData, draftId]);

  return (
    <div className="flex-1 flex flex-col bg-white rounded-xl p-6 border border-gray-200">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-700">
          {id ? "Continue Draft" : "Add New Member"}
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
          <BasicInfoStep
            organizations={organizations}
            events={events}
            coordinators={coordinators}
            formData={formData}
            formType={formType}
            setFormType={setFormType}
            updateField={updateField}
          />
        )}

        {/* STEP 2 — PERSONAL */}
        {step === 2 && (
          <PersonalInfoStep
            formData={formData}
            updateNestedField={updateNestedField}
          />
        )}

        {/* STEP 3 — CONTACT */}
        {step === 3 && (
          <ContactInfoStep
            formData={formData}
            formType={formType}
            updateNestedField={updateNestedField}
          />
        )}

        {/* STEP 4 — ADDRESS */}
        {step === 4 && (
          <AddressStep
            formData={formData}
            formType={formType}
            province={province}
            setProvince={setProvince}
            setDistrict={setDistrict}
            updateNestedField={updateNestedField}
          />
        )}

        {/* STEP 5 — BUSINESS / PROFESSIONAL */}
        {step === 5 && (
          <>
            {formType === "type2" ? (
              <BusinessInfoStep
                formData={formData}
                updateNestedField={updateNestedField}
              />
            ) : (
              <ProfessionalInfoStep
                formData={formData}
                updateNestedField={updateNestedField}
              />
            )}
          </>
        )}

      {/* STEP FINAL */}
      {step === totalSteps && (
        <PhotoStep
          photo={formData.photo}
          updateField={updateField}
        />
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