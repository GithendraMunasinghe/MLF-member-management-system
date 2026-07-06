import Section from "./Section";
import DetailRow from "./DetailRow";
import EditableRow from "./EditableRow";

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

export default function ProfessionalInfoSection({
  current,
  editData,
  isEditing,
  updateNested,
}: Props) {
  return (
    <Section title="Professional Information">
      {isEditing ? (
        <>
          <EditableRow
            label="Job Status"
            value={editData?.professional?.jobStatus}
            onChange={(v) =>
              updateNested("professional", "jobStatus", v)
            }
          />

          <EditableRow
            label="Work Experience"
            value={editData?.professional?.workExperience}
            onChange={(v) =>
              updateNested("professional", "workExperience", v)
            }
          />

          <EditableRow
            label="Workplace Address"
            value={editData?.professional?.workplaceAddress}
            onChange={(v) =>
              updateNested("professional", "workplaceAddress", v)
            }
          />
        </>
      ) : (
        <>
          <DetailRow
            label="Job Status"
            value={current.professional?.jobStatus}
          />

          <DetailRow
            label="Work Experience"
            value={current.professional?.workExperience}
          />

          <DetailRow
            label="Workplace Address"
            value={current.professional?.workplaceAddress}
          />
        </>
      )}
    </Section>
  );
}