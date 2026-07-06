import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import DatePickerInput from "@/components/adminpanel/inputs/DatePickerInput";

interface Props {
  formData: any;
  updateNestedField: (section: string, field: string, value: any) => void;
}

export default function PersonalInfoStep({
  formData,
  updateNestedField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Full Name *"
          value={formData.personalInfo.fullName}
          onChange={(val) =>
            updateNestedField("personalInfo", "fullName", val)
          }
        />

        <TextInput
          label="Certificate Name *"
          value={formData.personalInfo.certificateName}
          onChange={(val) =>
            updateNestedField("personalInfo", "certificateName", val)
          }
        />

        <TextInput
          label="Name with Initials"
          value={formData.personalInfo.nameWithInitials}
          onChange={(val) =>
            updateNestedField("personalInfo", "nameWithInitials", val)
          }
        />

        <p className="md:col-span-2 text-sm text-gray-900">
          Enter at least one: NIC Number, Passport Number, or Driving License.
        </p>

        <TextInput
          label="NIC Number *"
          value={formData.personalInfo.nicNumber}
          onChange={(val) =>
            updateNestedField("personalInfo", "nicNumber", val)
          }
        />

        <TextInput
          label="Passport Number *"
          value={formData.personalInfo.passportNumber}
          onChange={(val) =>
            updateNestedField("personalInfo", "passportNumber", val)
          }
        />

        <TextInput
          label="Driving License *"
          value={formData.personalInfo.drivingLicense}
          onChange={(val) =>
            updateNestedField("personalInfo", "drivingLicense", val)
          }
        />

        <SelectInput
          label="Gender *"
          value={formData.personalInfo.gender}
          options={["MALE", "FEMALE", "OTHER"]}
          onChange={(val) =>
            updateNestedField("personalInfo", "gender", val)
          }
        />

        <SelectInput
          label="Marital Status"
          value={formData.personalInfo.maritalStatus}
          options={["SINGLE", "MARRIED", "OTHER"]}
          onChange={(val) =>
            updateNestedField("personalInfo", "maritalStatus", val)
          }
        />

        <DatePickerInput
          label="Date of Birth"
          value={formData.personalInfo.dateOfBirth || ""}
          onChange={(val) =>
            updateNestedField("personalInfo", "dateOfBirth", val)
          }
        />
      </div>
    </>
  );
}