import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface Organization {
  _id: string;
  name: string;
  purposeType: "social_welfare" | "business";
  formType: "type1" | "type2";
  registrationNumber: string;
  logo?: string;
  memberCount: number;
}

interface Props {
  organization: Organization;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditOrganizationModal({
  organization,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [purposeType, setPurposeType] =
    useState<"social_welfare" | "business">("social_welfare");
  const [registrationNumber, setRegistrationNumber] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(organization.name || "");
    setPurposeType(organization.purposeType || "social_welfare");
    setRegistrationNumber(organization.registrationNumber || "");
    setLogoPreview(
      organization.logo ? `${API_URL}${organization.logo}` : null
    );
    setLogoFile(null);
  }, [organization]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("purposeType", purposeType);
      formData.append("registrationNumber", registrationNumber);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await axios.put(
        `${API_URL}/api/organizations/${organization._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Saved",
        description: "Organization updated successfully.",
        variant: "success",
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      console.error("Failed to update organization", err);

      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update organization.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-700 mb-5">
          Edit Organization
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose Type
            </label>

            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={purposeType === "social_welfare"}
                  onChange={() => setPurposeType("social_welfare")}
                />
                Social Welfare Purpose
              </label>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  checked={purposeType === "business"}
                  onChange={() => setPurposeType("business")}
                />
                Business Purpose
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              {purposeType === "social_welfare"
                ? "This organization will use Type 1 member form."
                : "This organization will use Type 2 member form."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>
            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>

            {logoPreview && (
              <div className="mb-3">
                <img
                  src={logoPreview}
                  alt="Organization Logo"
                  className="w-20 h-20 object-cover rounded-full border"
                />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setLogoFile(file);

                if (file) {
                  setLogoPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}