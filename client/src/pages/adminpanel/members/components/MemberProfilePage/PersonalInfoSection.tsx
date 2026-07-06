import Section from "./Section";
import DetailRow from "./DetailRow";
import EditableRow from "./EditableRow";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";

interface Props {
  current: any;
  editData: any;
  isEditing: boolean;

  updateNested: (
    section: string,
    field: string,
    value: any
  ) => void;
}

export default function PersonalInfoSection({
  current,
  editData,
  isEditing,
  updateNested,
}: Props) {
  return (
    <Section title="Personal Information">
        {isEditing ? (
          <>
            <EditableRow
              label="Full Name"
              value={editData?.personalInfo?.fullName}
              onChange={(v) =>
                updateNested("personalInfo", "fullName", v)
              }
            />
            <EditableRow
              label="Certificate Name"
              value={editData?.personalInfo?.certificateName}
              onChange={(v) =>
                updateNested("personalInfo", "certificateName", v)
              }
            />
            <EditableRow
              label="Name With Initials"
              value={editData?.personalInfo?.nameWithInitials}
              onChange={(v) =>
                updateNested("personalInfo", "nameWithInitials", v)
              }
            />
            <EditableRow
              label="NIC Number"
              value={editData?.personalInfo?.nicNumber}
              onChange={(v) =>
                updateNested("personalInfo", "nicNumber", v)
              }
            />
            <EditableRow
              label="Passport Number"
              value={editData?.personalInfo?.passportNumber}
              onChange={(v) =>
                updateNested("personalInfo", "passportNumber", v)
              }
            />
            <EditableRow
              label="Driving License"
              value={editData?.personalInfo?.drivingLicense}
              onChange={(v) =>
                updateNested("personalInfo", "drivingLicense", v)
              }
            />
            <div className="border-b border-gray-100 py-3">
              <p className="text-xs text-gray-400">Gender</p>
              <SelectInput
                label="Gender"
                size="sm"
                compact
                hideLabel
                value={editData?.personalInfo?.gender || ""}
                options={["MALE", "FEMALE", "OTHER"]}
                onChange={(v) =>
                  updateNested("personalInfo", "gender", v)
                }
              />
            </div>
            <div className="border-b border-gray-100 py-3">
              <p className="text-xs text-gray-400">Marital Status</p>
              <SelectInput
                label="Marital Status"
                size="sm"
                compact
                hideLabel
                value={editData?.personalInfo?.maritalStatus || ""}
                options={["SINGLE", "MARRIED", "OTHER"]}
                onChange={(v) =>
                  updateNested("personalInfo", "maritalStatus", v)
                }
              />
            </div>
            <EditableRow
              label="Date of Birth"
              type="date"
              value={editData?.personalInfo?.dateOfBirth?.slice(0, 10)}
              onChange={(v) =>
                updateNested("personalInfo", "dateOfBirth", v)
              }
            />
          </>
        ) : (
          <>
            <DetailRow
              label="Full Name"
              value={current.personalInfo?.fullName}
            />
            <DetailRow
              label="Certificate Name"
              value={current.personalInfo?.certificateName}
            />
            <DetailRow
              label="Name With Initials"
              value={current.personalInfo?.nameWithInitials}
            />
            <DetailRow
              label="NIC Number"
              value={current.personalInfo?.nicNumber}
            />
            <DetailRow
              label="Passport Number"
              value={current.personalInfo?.passportNumber}
            />
            <DetailRow
              label="Driving License"
              value={current.personalInfo?.drivingLicense}
            />
            <DetailRow
              label="Gender"
              value={current.personalInfo?.gender}
            />
            <DetailRow
              label="Marital Status"
              value={current.personalInfo?.maritalStatus}
            />
            <DetailRow
              label="Date of Birth"
              value={
                current.personalInfo?.dateOfBirth
                  ? new Date(
                      current.personalInfo.dateOfBirth
                    ).toLocaleDateString()
                  : "-"
              }
            />
          </>
        )}

    </Section>
  );
}