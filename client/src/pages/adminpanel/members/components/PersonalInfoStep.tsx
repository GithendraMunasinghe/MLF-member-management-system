import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import DatePickerInput from "@/components/adminpanel/inputs/DatePickerInput";

interface Props {
  updateNestedField: (section: string, field: string, value: any) => void;
}

export default function PersonalInfoStep({ updateNestedField }: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Full Name *"
          onChange={(val) =>
            updateNestedField("personalInfo", "fullName", val)
          }
        />

        <TextInput
          label="Certificate Name *"
          onChange={(val) =>
            updateNestedField("personalInfo", "certificateName", val)
          }
        />

        <TextInput
          label="Name with Initials"
          onChange={(val) =>
            updateNestedField("personalInfo", "nameWithInitials", val)
          }
        />

        <p className="md:col-span-2 text-sm text-gray-900">
          Enter at least one: NIC Number, Passport Number, or Driving License.
        </p>

        <TextInput
          label="NIC Number *"
          onChange={(val) =>
            updateNestedField("personalInfo", "nicNumber", val)
          }
        />

        <TextInput
          label="Passport Number *"
          onChange={(val) =>
            updateNestedField("personalInfo", "passportNumber", val)
          }
        />

        <TextInput
          label="Driving License *"
          onChange={(val) =>
            updateNestedField("personalInfo", "drivingLicense", val)
          }
        />

        <SelectInput
          label="Gender *"
          options={["MALE", "FEMALE", "OTHER"]}
          onChange={(val) =>
            updateNestedField("personalInfo", "gender", val)
          }
        />

        <SelectInput
          label="Marital Status"
          options={["SINGLE", "MARRIED", "OTHER"]}
          onChange={(val) =>
            updateNestedField("personalInfo", "maritalStatus", val)
          }
        />

        <DatePickerInput
          label="Date of Birth"
          onChange={(val) =>
            updateNestedField("personalInfo", "dateOfBirth", val)
          }
        />
      </div>
    </>
  );
}