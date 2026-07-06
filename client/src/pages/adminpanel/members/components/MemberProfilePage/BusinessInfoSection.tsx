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

export default function BusinessInfoSection({
  current,
  editData,
  isEditing,
  updateNested,
}: Props) {
  return (
    <Section title="Business Information">
      {isEditing ? (
        <>
          <EditableRow
            label="Business Name"
            value={editData?.business?.name}
            onChange={(v) => updateNested("business", "name", v)}
          />

          <EditableRow
            label="About"
            value={editData?.business?.about}
            onChange={(v) => updateNested("business", "about", v)}
          />

          <EditableRow
            label="Business Registration Number"
            value={editData?.business?.registrationNumber}
            onChange={(v) =>
              updateNested("business", "registrationNumber", v)
            }
          />

          <EditableRow
            label="Contact Number"
            value={editData?.business?.contactNumber}
            onChange={(v) =>
              updateNested("business", "contactNumber", v)
            }
          />

          <EditableRow
            label="Business Email"
            value={editData?.business?.email}
            onChange={(v) => updateNested("business", "email", v)}
          />

          <EditableRow
            label="Website"
            value={editData?.business?.website}
            onChange={(v) => updateNested("business", "website", v)}
          />

          <EditableRow
            label="Started Year"
            value={editData?.business?.startedYear}
            onChange={(v) =>
              updateNested("business", "startedYear", v)
            }
          />

          <EditableRow
            label="Business Address"
            value={editData?.business?.address}
            onChange={(v) => updateNested("business", "address", v)}
          />

          <EditableRow
            label="Number of Branches"
            value={editData?.business?.numberOfBranches}
            onChange={(v) =>
              updateNested("business", "numberOfBranches", v)
            }
          />

          <EditableRow
            label="Portal Name"
            value={editData?.business?.portalName}
            onChange={(v) =>
              updateNested("business", "portalName", v)
            }
          />

          <EditableRow
            label="Grade"
            value={editData?.business?.grade}
            onChange={(v) => updateNested("business", "grade", v)}
          />
        </>
      ) : (
        <>
          <DetailRow
            label="Business Name"
            value={current.business?.name}
          />

          <DetailRow
            label="About"
            value={current.business?.about}
          />

          <DetailRow
            label="Business Registration Number"
            value={current.business?.registrationNumber}
          />

          <DetailRow
            label="Contact Number"
            value={current.business?.contactNumber}
          />

          <DetailRow
            label="Business Email"
            value={current.business?.email}
          />

          <DetailRow
            label="Website"
            value={current.business?.website}
          />

          <DetailRow
            label="Started Year"
            value={current.business?.startedYear}
          />

          <DetailRow
            label="Business Address"
            value={current.business?.address}
          />

          <DetailRow
            label="Number of Branches"
            value={current.business?.numberOfBranches}
          />

          <DetailRow
            label="Portal Name"
            value={current.business?.portalName}
          />

          <DetailRow
            label="Grade"
            value={current.business?.grade}
          />
        </>
      )}
    </Section>
  );
}