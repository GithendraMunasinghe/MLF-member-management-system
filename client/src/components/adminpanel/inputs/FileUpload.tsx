import { useState } from "react";
import { Upload } from "lucide-react";

export default function FileUpload({
  label,
  onChange,
}: {
  label: string;
  onChange?: (file: File) => void;
}) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <label className="flex items-center gap-3 p-4 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
        <Upload size={18} />

        <span className="text-gray-500">
          {fileName || "Upload File"}
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              setFileName(file.name);
              onChange?.(file);
            }
          }}
        />
      </label>
    </div>
  );
}