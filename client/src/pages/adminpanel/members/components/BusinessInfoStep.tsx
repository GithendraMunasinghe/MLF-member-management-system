import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";

interface Props {
  formData: any;
  updateNestedField: (
    section: string,
    field: string,
    value: any
  ) => void;
}

export default function BusinessInfoStep({
  formData,
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
          value={formData.business.name}
          onChange={(v) =>
            updateNestedField("business", "name", v)
          }
        />

        <TextInput
          label="About Business"
          value={formData.business.about}
          onChange={(v) =>
            updateNestedField("business", "about", v)
          }
        />

        <TextInput
          label="Registration Number"
          value={formData.business.registrationNumber}
          onChange={(v) =>
            updateNestedField("business", "registrationNumber", v)
          }
        />

        <TextInput
          label="Contact Number"
          value={formData.business.contactNumber}
          onChange={(v) =>
            updateNestedField("business", "contactNumber", v)
          }
        />

        <TextInput
          label="Email"
          value={formData.business.email}
          onChange={(v) =>
            updateNestedField("business", "email", v)
          }
        />

        <TextInput
          label="Website"
          value={formData.business.website}
          onChange={(v) =>
            updateNestedField("business", "website", v)
          }
        />

        <TextInput
          label="Started Year"
          value={formData.business.startedYear}
          onChange={(v) =>
            updateNestedField("business", "startedYear", v)
          }
        />

        <TextInput
          label="Business Address"
          value={formData.business.address}
          onChange={(v) =>
            updateNestedField("business", "address", v)
          }
        />

        <TextInput
          label="Number of Branches"
          value={formData.business.numberOfBranches}
          onChange={(v) =>
            updateNestedField("business", "numberOfBranches", v)
          }
        />

        <TextInput
          label="Portal Name"
          value={formData.business.portalName}
          onChange={(v) =>
            updateNestedField("business", "portalName", v)
          }
        />

        <SelectInput
          label="Grade"
          value={formData.business.grade}
          options={[
            "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "10",
          ]}
          onChange={(v) =>
            updateNestedField("business", "grade", v)
          }
        />
      </div>
    </>
  );
}