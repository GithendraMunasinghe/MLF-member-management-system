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

export default function ContactInfoSection({
  current,
  editData,
  isEditing,
  updateNested,
}: Props) {
  return (
    <Section title="Contact Information">
      {isEditing ? (
        <>
          <EditableRow
            label="Mobile Phone"
            value={editData?.contact?.mobilePhone}
            onChange={(v) =>
              updateNested("contact", "mobilePhone", v)
            }
          />

          <EditableRow
            label="WhatsApp Number"
            value={editData?.contact?.whatsappNumber}
            onChange={(v) =>
              updateNested("contact", "whatsappNumber", v)
            }
          />

          <EditableRow
            label="Email"
            value={editData?.contact?.email}
            onChange={(v) =>
              updateNested("contact", "email", v)
            }
          />
        </>
      ) : (
        <>
          <DetailRow
            label="Mobile Phone"
            value={current.contact?.mobilePhone}
          />

          <DetailRow
            label="WhatsApp Number"
            value={current.contact?.whatsappNumber}
          />

          <DetailRow
            label="Email"
            value={current.contact?.email}
          />
        </>
      )}
    </Section>
  );
}