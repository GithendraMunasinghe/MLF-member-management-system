import { Upload } from "lucide-react";

interface Props {
  label: string;
  value?: File | null;
  onChange?: (file: File) => void;
}

export default function FileUpload({
  label,
  value,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-500 font-medium">
        {label}
      </label>

      <label className="flex items-center gap-3 p-4 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
        <Upload size={18} />

        <span className="text-gray-500">
          {value?.name || "Upload File"}
        </span>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];

            if (file) {
              onChange?.(file);
            }
          }}
        />
      </label>
    </div>
  );
}