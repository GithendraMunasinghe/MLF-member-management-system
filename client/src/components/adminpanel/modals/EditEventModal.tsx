import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface Organization {
  _id: string;
  name: string;
}

interface EventItem {
  _id: string;
  name: string;
  date?: string;
  description?: string;
  logo?: string;
  organizationId?: Organization;
  memberCount: number;
}

interface Props {
  event: EventItem;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditEventModal({
  event,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    setName(event.name || "");
    setOrganizationId(event.organizationId?._id || "");
    setDate(event.date ? event.date.slice(0, 10) : "");
    setDescription(event.description || "");
    setLogoPreview(event.logo ? `${API_URL}${event.logo}` : null);
    setLogoFile(null);
  }, [event]);

  const handleSubmit = async () => {
    if (!organizationId) {
      toast({
        title: "Missing organization",
        description: "Please select an organization for this event.",
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

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      await axios.put(`${API_URL}/api/events/${event._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Saved",
        description: "Event updated successfully.",
        variant: "success",
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      toast({
        title: "Update failed",
        description:
          err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update event.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[440px] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-700 mb-5">
          Edit Event
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

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg min-h-[90px]"
          />

          {logoPreview && (
            <img
              src={logoPreview}
              alt="Event Logo"
              className="w-20 h-20 object-cover rounded-full border"
            />
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