import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddOrganizationModal({
  onClose,
  onCreated,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [purposeType, setPurposeType] =
    useState<"social_welfare" | "business">("social_welfare");

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

      await axios.post(
        `${API_URL}/api/organizations`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Success",
        description: "Organization created successfully.",
        variant: "success",
      });

      onCreated();
      onClose();

    } catch (err: any) {
      console.error("Failed to create organization", err);

      toast({
        title: "Creation failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create organization.",
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
          Add New Organization
        </h2>

        <div className="space-y-4">
          {/* Organization Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Purpose Type */}
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
                ? "This organization will use Type 1 member registration forms."
                : "This organization will use Type 2 member registration forms."}
            </p>
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number
            </label>

            <input
              type="text"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Organization"}
          </Button>
        </div>
      </div>
    </div>
  );
}