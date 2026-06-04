import TextInput from "@/components/adminpanel/inputs/TextInput";

interface Props {
  updateNestedField: (
    section: string,
    field: string,
    value: any
  ) => void;
}

export default function ProfessionalInfoStep({
  updateNestedField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Professional Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TextInput
          label="Job Status"
          onChange={(v) =>
            updateNestedField("professional", "jobStatus", v)
          }
        />

        <TextInput
          label="Work Experience"
          onChange={(v) =>
            updateNestedField("professional", "workExperience", v)
          }
        />

        <TextInput
          label="Workplace Address"
          onChange={(v) =>
            updateNestedField("professional", "workplaceAddress", v)
          }
        />

      </div>
    </>
  );
}