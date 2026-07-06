import FileUpload from "@/components/adminpanel/inputs/FileUpload";

interface Props {
  photo: File | null;
  updateField: (field: any, value: any) => void;
}

export default function PhotoStep({ photo, updateField }: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Profile Photo</h2>

      <FileUpload
        label="Upload Profile Photo"
        value={photo}
        onChange={(file) => updateField("photo", file)}
      />
    </>
  );
}