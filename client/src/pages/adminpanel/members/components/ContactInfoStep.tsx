import TextInput from "@/components/adminpanel/inputs/TextInput";

interface Props {
  formType: "type1" | "type2";
  updateNestedField: (
    section: string,
    field: string,
    value: any
  ) => void;
}

export default function ContactInfoStep({
  formType,
  updateNestedField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Contact Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TextInput
          label="Mobile Phone *"
          onChange={(val) =>
            updateNestedField("contact", "mobilePhone", val)
          }
        />

        <TextInput
          label="WhatsApp Number"
          onChange={(val) =>
            updateNestedField("contact", "whatsappNumber", val)
          }
        />

        {formType === "type2" && (
          <TextInput
            label="Email"
            type="email"
            onChange={(val) =>
              updateNestedField("contact", "email", val)
            }
          />
        )}

      </div>
    </>
  );
}