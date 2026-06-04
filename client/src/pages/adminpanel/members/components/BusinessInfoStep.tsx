import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";

interface Props {
  updateNestedField: (
    section: string,
    field: string,
    value: any
  ) => void;
}

export default function BusinessInfoStep({
  updateNestedField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Business Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <TextInput
          label="Business Name"
          onChange={(v) =>
            updateNestedField("business", "name", v)
          }
        />

        <TextInput
          label="About Business"
          onChange={(v) =>
            updateNestedField("business", "about", v)
          }
        />

        <TextInput
          label="Registration Number"
          onChange={(v) =>
            updateNestedField("business", "registrationNumber", v)
          }
        />

        <TextInput
          label="Contact Number"
          onChange={(v) =>
            updateNestedField("business", "contactNumber", v)
          }
        />

        <TextInput
          label="Email"
          onChange={(v) =>
            updateNestedField("business", "email", v)
          }
        />

        <TextInput
          label="Website"
          onChange={(v) =>
            updateNestedField("business", "website", v)
          }
        />

        <TextInput
          label="Started Year"
          onChange={(v) =>
            updateNestedField("business", "startedYear", v)
          }
        />

        <TextInput
          label="Business Address"
          onChange={(v) =>
            updateNestedField("business", "address", v)
          }
        />

        <TextInput
          label="Number of Branches"
          onChange={(v) =>
            updateNestedField("business", "numberOfBranches", v)
          }
        />

        <TextInput
          label="Portal Name"
          onChange={(v) =>
            updateNestedField("business", "portalName", v)
          }
        />

        <SelectInput
          label="Grade"
          options={[
            "0","1","2","3","4","5",
            "6","7","8","9","10"
          ]}
          onChange={(v) =>
            updateNestedField("business", "grade", v)
          }
        />

      </div>
    </>
  );
}