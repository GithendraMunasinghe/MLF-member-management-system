import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Member } from "@/types/member";
import { useToast } from "@/components/ui/use-toast";
import { API_URL } from "@/config/api";

interface EditMemberModalProps {
  member: Member;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditMemberModal({
  member,
  onClose,
  onUpdated,
}: EditMemberModalProps) {

  const { toast } = useToast(); // ✅ moved inside component

  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState<number>(0);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  //useEffect(() => {
  //  setName(member.name);
  //  setRegNo(member.regNo);
  //  setDescription(member.description);
  //  setImagePreview(member.photo || null);
  //}, [member]);

  useEffect(() => {

  setName(member.name);
  setRegNo(member.regNo);

  setImagePreview(member.photo ? `${API_URL}${member.photo}` : null);
  setImageFile(null);
}, [member]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", name);
      formData.append("regNo", regNo.toString());

      if (imageFile) {
        formData.append("photo", imageFile);
      }

      await axios.put(
        `${API_URL}/api/members/${member._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast({
        title: "Saved",
        description: "Member updated successfully",
        variant: "success",
      });

      onUpdated();
      onClose();

    } catch (err) {
      console.error(err);

      toast({
        title: "Update failed",
        description: "Failed to update member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Edit Member</h2>

        {/* Image Upload */}
        <div className="mb-4">
          {imagePreview ? (
            <div className="relative w-24 h-24">
              <img
                src={imagePreview || "/placeholder-user.png"}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <button
                onClick={() => {
                  setImagePreview(null);
                  setImageFile(null);
                }}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 text-center">
              <span className="text-gray-400 text-sm">Upload Image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
          )}
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Registration Number */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            type="number"
            value={regNo}
            onChange={(e) => setRegNo(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}