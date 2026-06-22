import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";

interface Props {
  organizations: any[];
  events: any[];
  coordinators: any[];
  formData: any;
  formType: "type1" | "type2";
  setFormType: (value: "type1" | "type2") => void;
  updateField: (field: any, value: any) => void;
}

export default function BasicInfoStep({
  organizations,
  events,
  coordinators,
  formData,
  formType,
  setFormType,
  updateField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <SelectInput
          label="Organization *"
          options={organizations.map((org) => ({
            label: org.name,
            value: org._id,
          }))}
          onChange={(value: string) => {
            const selectedOrg = organizations.find(
              (org) => org._id === value
            );

            updateField("organizationId", value);

            // Keep this for backward compatibility
            updateField(
              "organizationType",
              selectedOrg?.purposeType === "business"
                ? "IBDF"
                : "Foundation"
            );

            // Reset event when organization changes
            updateField("eventId", "");

            // NEW LOGIC: Use organization's formType
            const selectedFormType =
              selectedOrg?.formType || "type1";

            setFormType(selectedFormType);
            updateField("formType", selectedFormType);
          }}
        />

        <SelectInput
          label="Event *"
          options={events.map((e) => ({
            label: e.name,
            value: e._id,
          }))}
          onChange={(val) => updateField("eventId", val)}
          disabled={!formData.organizationId}
        />

        <SelectInput
          label="Coordinator *"
          options={coordinators.map((c) => ({
            label: c.name,
            value: c._id,
          }))}
          onChange={(val) => updateField("coordinatorId", val)}
        />

        <TextInput
          label="Registration Number *"
          onChange={(val) => updateField("regNo", val)}
        />

        {formType === "type2" && (
          <>
            <TextInput
              label="Batch Number *"
              onChange={(val) => updateField("batchNumber", val)}
            />

            <TextInput
              label="Registered Year *"
              onChange={(val) => updateField("registeredYear", val)}
            />
          </>
        )}
      </div>
    </>
  );
}