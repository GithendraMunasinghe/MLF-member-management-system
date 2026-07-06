import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { ArrowLeft, Pencil, Trash, Save, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

import MemberProfileSidebar from "./components/MemberProfilePage/MemberProfileSidebar";
import PersonalInfoSection from "./components/MemberProfilePage/PersonalInfoSection";
import ContactInfoSection from "./components/MemberProfilePage/ContactInfoSection";
import AddressInfoSection from "./components/MemberProfilePage/AddressInfoSection";
import ProfessionalInfoSection from "./components/MemberProfilePage/ProfessionalInfoSection";
import BusinessInfoSection from "./components/MemberProfilePage/BusinessInfoSection";

interface MemberProfile {
  _id: string;
  regNo?: string;
  photo?: string;
  formType?: "type1" | "type2";
  organizationType?: string;
  batchNumber?: string;
  registeredYear?: string;
  createdAt?: string;
  categories?: string[];
  categoryTitles?: {
    category?: string;
    titles?: string[];
  }[];

  organizationId?: { _id?: string; name?: string };
  eventId?: { _id?: string; name?: string; categories?: string[] };
  coordinatorId?: { _id?: string; name?: string; coordinatorId?: string };

  personalInfo?: {
    fullName?: string;
    certificateName?: string;
    nameWithInitials?: string;
    nicNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
    gender?: string;
    maritalStatus?: string;
    dateOfBirth?: string;
  };

  contact?: {
    mobilePhone?: string;
    whatsappNumber?: string;
    email?: string;
  };

  address?: {
    permanentAddress?: string;
    province?: string;
    district?: string;
    divisionalSecretariat?: string;
    gramaNiladhariDivision?: string;
    policeDivision?: string;
  };

  professional?: {
    jobStatus?: string;
    workExperience?: string;
    workplaceAddress?: string;
  };

  business?: {
    name?: string;
    about?: string;
    registrationNumber?: string;
    contactNumber?: string;
    email?: string;
    website?: string;
    startedYear?: string;
    address?: string;
    numberOfBranches?: number;
    portalName?: string;
    grade?: number;
  };
}

interface Coordinator {
  _id: string;
  name: string;
  coordinatorId?: string;
}

export default function MemberProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [member, setMember] = useState<MemberProfile | null>(null);
  const [editData, setEditData] = useState<MemberProfile | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/members/${id}`);
      setMember(res.data);
      setEditData(res.data);
    } catch (err) {
      console.error("Failed to fetch member profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoordinators = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/coordinators`);
      setCoordinators(res.data);
    } catch (err) {
      console.error("Failed to fetch coordinators", err);
    }
  };

  useEffect(() => {
    fetchMember();
    fetchCoordinators();
  }, [id]);

  const updateNested = (
    section: keyof MemberProfile,
    field: string,
    value: string
  ) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...(prev?.[section] || {}),
        [field]: value,
      },
    }));
  };

  const toggleCategory = (category: string) => {
    setEditData((prev) => {
      if (!prev) return prev;

      const currentCategories = prev.categories || [];
      const currentCategoryTitles = prev.categoryTitles || [];

      const isSelected = currentCategories.includes(category);

      const updatedCategories = isSelected
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category];

      const updatedCategoryTitles = isSelected
        ? currentCategoryTitles.filter((item) => item.category !== category)
        : [
            ...currentCategoryTitles,
            {
              category,
              titles: [""],
            },
          ];

      return {
        ...prev,
        categories: updatedCategories,
        categoryTitles: updatedCategoryTitles,
      };
    });
  };

  const updateCategoryTitle = (
    category: string,
    titleIndex: number,
    value: string
  ) => {
    setEditData((prev) => {
      if (!prev) return prev;

      const currentCategoryTitles = prev.categoryTitles || [];

      const existing = currentCategoryTitles.find(
        (item) => item.category === category
      );

      let updatedCategoryTitles;

      if (existing) {
        updatedCategoryTitles = currentCategoryTitles.map((item) =>
          item.category === category
            ? {
                ...item,
                titles:
                  item.titles?.map((title, index) =>
                    index === titleIndex ? value : title
                  ) || [],
              }
            : item
        );
      } else {
        updatedCategoryTitles = [
          ...currentCategoryTitles,
          {
            category,
            titles: [value],
          },
        ];
      }

      return {
        ...prev,
        categoryTitles: updatedCategoryTitles,
      };
    });
  };

  const addCategoryTitle = (category: string) => {
    setEditData((prev) => {
      if (!prev) return prev;

      const currentCategoryTitles = prev.categoryTitles || [];

      const existing = currentCategoryTitles.find(
        (item) => item.category === category
      );

      if (existing && (existing.titles || []).length >= 2) {
        return prev;
      }

      const updatedCategoryTitles = existing
        ? currentCategoryTitles.map((item) =>
            item.category === category
              ? {
                  ...item,
                  titles: [...(item.titles || []), ""],
                }
              : item
          )
        : [
            ...currentCategoryTitles,
            {
              category,
              titles: [""],
            },
          ];

      return {
        ...prev,
        categoryTitles: updatedCategoryTitles,
      };
    });
  };

  const removeCategoryTitle = (category: string, titleIndex: number) => {
    setEditData((prev) => {
      if (!prev) return prev;

      const updatedCategoryTitles = (prev.categoryTitles || [])
        .map((item) =>
          item.category === category
            ? {
                ...item,
                titles: (item.titles || []).filter(
                  (_, index) => index !== titleIndex
                ),
              }
            : item
        )
        .filter((item) => (item.titles || []).length > 0);

      return {
        ...prev,
        categoryTitles: updatedCategoryTitles,
      };
    });
  };

  const handleSave = async () => {
    if (!editData) return;

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("regNo", editData.regNo || "");
      formData.append("formType", editData.formType || "");
      formData.append("organizationType", editData.organizationType || "");

      if (editData.organizationId?._id) {
        formData.append("organizationId", editData.organizationId._id);
      }

      if (editData.eventId?._id) {
        formData.append("eventId", editData.eventId._id);
      }

      if (editData.coordinatorId?._id) {
        formData.append("coordinatorId", editData.coordinatorId._id);
      }

      formData.append("categories", JSON.stringify(editData.categories || []));
      formData.append(
        "categoryTitles",
        JSON.stringify(editData.categoryTitles || [])
      );

      formData.append("batchNumber", editData.batchNumber || "");
      formData.append("registeredYear", editData.registeredYear || "");

      formData.append(
        "personalInfo",
        JSON.stringify(editData.personalInfo || {})
      );
      formData.append("contact", JSON.stringify(editData.contact || {}));
      formData.append("address", JSON.stringify(editData.address || {}));
      formData.append(
        "professional",
        JSON.stringify(editData.professional || {})
      );
      formData.append("business", JSON.stringify(editData.business || {}));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Authentication error",
          description: "Please login again.",
          variant: "destructive",
        });
        return;
      }

      await axios.put(`${API_URL}/api/members/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Saved",
        description: "Member profile updated successfully.",
        variant: "success",
      });

      setIsEditing(false);
      setPhotoFile(null);
      fetchMember();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update member profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?"
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/api/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Deleted",
        description: "Member deleted successfully.",
        variant: "success",
      });

      navigate("/admin-dashboard/members");
    } catch (err: any) {
      toast({
        title: "Delete failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to delete member.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const current = isEditing ? editData : member;

  const getTitlesForCategory = (category: string) => {
    const categoryTitle = current?.categoryTitles?.find(
      (item) => item.category === category
    );

    return categoryTitle?.titles?.filter(Boolean) || [];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!current) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 text-center text-gray-500">
        Member profile not found.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} />
          Back
        </Button>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => {
                  setEditData(member);
                  setPhotoFile(null);
                  setIsEditing(false);
                }}
              >
                <X size={16} />
                Cancel
              </Button>

              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={handleSave}
                disabled={saving}
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2"
                onClick={() => setIsEditing(true)}
              >
                <Pencil size={16} />
                Edit Member
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash size={16} />
                {deleting ? "Deleting..." : "Delete Member"}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <MemberProfileSidebar
          current={current}
          editData={editData}
          isEditing={isEditing}
          coordinators={coordinators}
          setEditData={setEditData}
          toggleCategory={toggleCategory}
          getTitlesForCategory={getTitlesForCategory}
          setPhotoFile={setPhotoFile}
          updateCategoryTitle={updateCategoryTitle}
          addCategoryTitle={addCategoryTitle}
          removeCategoryTitle={removeCategoryTitle}
        />

        <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
          <PersonalInfoSection
            current={current}
            editData={editData}
            isEditing={isEditing}
            updateNested={updateNested}
          />

          <ContactInfoSection
            current={current}
            editData={editData}
            isEditing={isEditing}
            updateNested={updateNested}
          />

          <AddressInfoSection
            current={current}
            editData={editData}
            isEditing={isEditing}
            updateNested={updateNested}
          />

          {current.formType === "type1" ? (
            <ProfessionalInfoSection
              current={current}
              editData={editData}
              isEditing={isEditing}
              updateNested={updateNested}
            />
          ) : (
            <BusinessInfoSection
              current={current}
              editData={editData}
              isEditing={isEditing}
              updateNested={updateNested}
            />
          )}
        </div>
      </div>
    </div>
  );
}