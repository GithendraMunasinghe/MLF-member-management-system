import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/config/api";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCoordinatorModal({ onClose, onCreated }: Props) {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [coordinatorId, setCoordinatorId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

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

      await axios.post(`${API_URL}/api/coordinators`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Success",
        description: "Coordinator created successfully.",
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
          "Failed to create coordinator.",
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
          Add New Coordinator
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

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
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
            {saving ? "Saving..." : "Save Coordinator"}
          </Button>
        </div>
      </div>
    </div>
  );
}