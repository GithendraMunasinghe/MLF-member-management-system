import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";
import { Plus, X } from "lucide-react";
import DatePickerInput from "@/components/adminpanel/inputs/DatePickerInput";

interface Organization {
  _id: string;
  name: string;
}

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

const STATIC_CATEGORIES = ["Doctorate", "Professorship", "Deshamanya"];

export default function AddEventModal({ onClose, onCreated }: Props) {
  const { toast } = useToast();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [selectedStaticCategories, setSelectedStaticCategories] =
    useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([""]);

  const fetchOrganizations = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/organizations`);
      setOrganizations(res.data);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const toggleStaticCategory = (category: string) => {
    setSelectedStaticCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const updateCustomCategory = (index: number, value: string) => {
    setCustomCategories((prev) =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const addCustomCategoryInput = () => {
    setCustomCategories((prev) => [...prev, ""]);
  };

  const removeCustomCategoryInput = (index: number) => {
    setCustomCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const buildFinalCategories = () => {
    const cleanedCustomCategories = customCategories
      .map((item) => item.trim())
      .filter(Boolean);

    return Array.from(
      new Set([...selectedStaticCategories, ...cleanedCustomCategories])
    );
  };

  const handleSubmit = async () => {
    if (!organizationId) {
      toast({
        title: "Missing organization",
        description: "Please select an organization for this event.",
        variant: "destructive",
      });
      return;
    }

    if (!date || date.length !== 10) {
      toast({
        title: "Invalid date",
        description: "Please enter event date as YYYY-MM-DD.",
        variant: "destructive",
      });
      return;
    }

    const finalCategories = buildFinalCategories();

    if (finalCategories.length === 0) {
      toast({
        title: "Missing categories",
        description: "Please select or add at least one category.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("organizationId", organizationId);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("categories", JSON.stringify(finalCategories));

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await axios.post(`${API_URL}/api/events`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Event created successfully.",
        variant: "success",
      });

      onCreated();
      onClose();
    } catch (err: any) {
      toast({
        title: "Creation failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to create event.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] max-h-[90vh] overflow-y-auto shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-700 mb-5">
          Create New Event
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <select
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-white"
          >
            <option value="">Select Organization</option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>

          <DatePickerInput
            label="Event Date"
            value={date}
            onChange={setDate}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg min-h-[90px]"
          />

          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Static Categories
            </h3>

            <div className="flex flex-col gap-2">
              {STATIC_CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedStaticCategories.includes(category)}
                    onChange={() => toggleStaticCategory(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">
                Custom Categories
              </h3>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={addCustomCategoryInput}
              >
                <Plus size={14} />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {customCategories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter custom category"
                    value={category}
                    onChange={(e) =>
                      updateCustomCategory(index, e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {customCategories.length > 1 && (
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() => removeCustomCategoryInput(index)}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="w-full text-sm"
          />
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
            {saving ? "Saving..." : "Create Event"}
          </Button>
        </div>
      </div>
    </div>
  );
}