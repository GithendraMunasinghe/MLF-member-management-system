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
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter((event) => {
    if (!event.date) return true;

    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return eventDate >= today;
  });

  const selectedEvent = upcomingEvents.find(
    (event) => event._id === formData.eventId
  );

  const eventCategories = selectedEvent?.categories || [];

  const toggleCategory = (category: string) => {
    const currentCategories = formData.categories || [];

    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((item: string) => item !== category)
      : [...currentCategories, category];

    updateField("categories", updatedCategories);
  };

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectInput
          label="Organization *"
          value={formData.organizationId}
          options={organizations.map((org) => ({
            label: org.name,
            value: org._id,
          }))}
          onChange={(value: string) => {
            const selectedOrg = organizations.find(
              (org) => org._id === value
            );

            updateField("organizationId", value);

            updateField(
              "organizationType",
              selectedOrg?.purposeType === "business"
                ? "IBDF"
                : "Foundation"
            );

            updateField("eventId", "");
            updateField("categories", []);

            const selectedFormType = selectedOrg?.formType || "type1";

            setFormType(selectedFormType);
            updateField("formType", selectedFormType);
          }}
        />

        <SelectInput
          label="Event *"
          value={formData.eventId}
          options={upcomingEvents.map((e) => ({
            label: e.name,
            value: e._id,
          }))}
          onChange={(val) => {
            updateField("eventId", val);
            updateField("categories", []);
          }}
          disabled={!formData.organizationId}
        />

        {formData.eventId && (
          <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Categories *
            </h3>

            {eventCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {eventCategories.map((category: string) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border rounded-lg px-3 py-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(formData.categories || []).includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    {category}
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No categories found for this event.
              </p>
            )}
          </div>
        )}

        <SelectInput
          label="Coordinator *"
          value={formData.coordinatorId}
          options={coordinators.map((c) => ({
            label: c.name,
            value: c._id,
          }))}
          onChange={(val) => updateField("coordinatorId", val)}
        />

        <TextInput
          label="Registration Number *"
          value={formData.regNo}
          onChange={(val) => updateField("regNo", val)}
        />

        {formType === "type2" && (
          <>
            <TextInput
              label="Batch Number *"
              value={formData.batchNumber}
              onChange={(val) => updateField("batchNumber", val)}
            />

            <TextInput
              label="Registered Year *"
              value={formData.registeredYear}
              onChange={(val) => updateField("registeredYear", val)}
            />
          </>
        )}
      </div>
    </>
  );
}