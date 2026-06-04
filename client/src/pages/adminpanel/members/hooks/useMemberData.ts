import { useEffect, useState } from "react";
import axios from "axios";

interface Params {
  id?: string;
  token: string | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  setDraftId: (id: string) => void;
  setFormType: (type: "type1" | "type2") => void;
  setProvince: (value: string) => void;
  setDistrict: (value: string) => void;
  toast: any;
}

export default function useMemberData({
  id,
  token,
  formData,
  setFormData,
  setDraftId,
  setFormType,
  setProvince,
  setDistrict,
  toast,
}: Params) {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [coordinators, setCoordinators] = useState<any[]>([]);

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

  useEffect(() => {
    const fetchDraft = async () => {
      if (!id) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/members/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const draft = res.data;

        setDraftId(draft._id);

        setFormData((prev: any) => ({
          ...prev,

          organizationId: draft.organizationId?._id || draft.organizationId || "",
          organizationType: draft.organizationType || "",
          formType: draft.formType || "type1",

          eventId: draft.eventId?._id || draft.eventId || "",
          coordinatorId: draft.coordinatorId?._id || draft.coordinatorId || "",

          regNo: draft.regNo || "",
          batchNumber: draft.batchNumber || "",
          registeredYear: draft.registeredYear || "",

          personalInfo: {
            fullName: draft.personalInfo?.fullName || "",
            certificateName: draft.personalInfo?.certificateName || "",
            nameWithInitials: draft.personalInfo?.nameWithInitials || "",
            nicNumber: draft.personalInfo?.nicNumber || "",
            passportNumber: draft.personalInfo?.passportNumber || "",
            drivingLicense: draft.personalInfo?.drivingLicense || "",
            gender: draft.personalInfo?.gender || "",
            maritalStatus: draft.personalInfo?.maritalStatus || "",
            dateOfBirth: draft.personalInfo?.dateOfBirth
              ? draft.personalInfo.dateOfBirth.split("T")[0]
              : "",
          },

          contact: {
            mobilePhone: draft.contact?.mobilePhone || "",
            whatsappNumber: draft.contact?.whatsappNumber || "",
            email: draft.contact?.email || "",
          },

          address: {
            permanentAddress: draft.address?.permanentAddress || "",
            province: draft.address?.province || "",
            district: draft.address?.district || "",
            divisionalSecretariat: draft.address?.divisionalSecretariat || "",
            gramaNiladhariDivision: draft.address?.gramaNiladhariDivision || "",
            policeDivision: draft.address?.policeDivision || "",
          },

          business: {
            name: draft.business?.name || "",
            about: draft.business?.about || "",
            registrationNumber: draft.business?.registrationNumber || "",
            contactNumber: draft.business?.contactNumber || "",
            email: draft.business?.email || "",
            website: draft.business?.website || "",
            startedYear: draft.business?.startedYear || "",
            address: draft.business?.address || "",
            numberOfBranches: draft.business?.numberOfBranches?.toString() || "",
            portalName: draft.business?.portalName || "",
            grade: draft.business?.grade?.toString() || "",
          },

          professional: {
            jobStatus: draft.professional?.jobStatus || "",
            workExperience: draft.professional?.workExperience || "",
            workplaceAddress: draft.professional?.workplaceAddress || "",
          },

          photo: null,
        }));

        setFormType(draft.formType || "type1");
        setProvince(draft.address?.province || "");
        setDistrict(draft.address?.district || "");
      } catch (err) {
        console.error("Failed to load draft", err);

        toast({
          title: "Error",
          description: "Failed to load draft member.",
          variant: "destructive",
        });
      }
    };

    fetchDraft();
  }, [id]);

  return {
    organizations,
    events,
    coordinators,
  };
}