import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface Coordinator {
  _id: string;
  name: string;
  coordinatorId: string;
  phoneNumber?: string;
  photo?: string;
  customerCount: number;
}

interface Props {
  coordinator: Coordinator;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditCoordinatorModal({
  coordinator,
  onClose,
  onUpdated,
}: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(coordinator.name || "");
    setCoordinatorId(coordinator.coordinatorId || "");
    setPhoneNumber(coordinator.phoneNumber || "");
    setPhotoPreview(coordinator.photo ? `${API_URL}${coordinator.photo}` : null);
    setPhotoFile(null);
  }, [coordinator]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("coordinatorId", coordinatorId);
      formData.append("phoneNumber", phoneNumber);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      await axios.put(
        `${API_URL}/api/coordinators/${coordinator._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Saved",
        description: "Coordinator updated successfully.",
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
          "Failed to update coordinator.",
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
          Edit Coordinator
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Coordinator Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Coordinator ID"
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />

          {photoPreview && (
            <img
              src={photoPreview}
              alt="Coordinator"
              className="w-20 h-20 object-cover rounded-full border"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhotoFile(file);

              if (file) {
                setPhotoPreview(URL.createObjectURL(file));
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