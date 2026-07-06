import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import { Plus, X } from "lucide-react";

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

  const getTitlesForCategory = (category: string) => {
    const existing = (formData.categoryTitles || []).find(
      (item: any) => item.category === category
    );

    return existing?.titles || [""];
  };

  const updateCategoryTitle = (
    category: string,
    index: number,
    value: string
  ) => {
    const currentCategoryTitles = formData.categoryTitles || [];

    const existing = currentCategoryTitles.find(
      (item: any) => item.category === category
    );

    let updatedCategoryTitles;

    if (existing) {
      updatedCategoryTitles = currentCategoryTitles.map((item: any) =>
        item.category === category
          ? {
              ...item,
              titles: item.titles.map((title: string, i: number) =>
                i === index ? value : title
              ),
            }
          : item
      );
    } else {
      updatedCategoryTitles = [
        ...currentCategoryTitles,
        {
          category,
          titles: [value],
        },
      ];
    }

    updateField("categoryTitles", updatedCategoryTitles);
  };

  const addTitleInput = (category: string) => {
    const currentCategoryTitles = formData.categoryTitles || [];

    const existing = currentCategoryTitles.find(
      (item: any) => item.category === category
    );

    if (existing && existing.titles.length >= 2) return;

    let updatedCategoryTitles;

    if (existing) {
      updatedCategoryTitles = currentCategoryTitles.map((item: any) =>
        item.category === category
          ? {
              ...item,
              titles: [...item.titles, ""],
            }
          : item
      );
    } else {
      updatedCategoryTitles = [
        ...currentCategoryTitles,
        {
          category,
          titles: ["", ""],
        },
      ];
    }

    updateField("categoryTitles", updatedCategoryTitles);
  };

  const removeTitleInput = (category: string, index: number) => {
    const currentCategoryTitles = formData.categoryTitles || [];

    const updatedCategoryTitles = currentCategoryTitles
      .map((item: any) =>
        item.category === category
          ? {
              ...item,
              titles: item.titles.filter((_: string, i: number) => i !== index),
            }
          : item
      )
      .filter((item: any) => item.titles.length > 0);

    updateField("categoryTitles", updatedCategoryTitles);
  };

  const toggleCategory = (category: string) => {
    const currentCategories = formData.categories || [];
    const currentCategoryTitles = formData.categoryTitles || [];

    const isSelected = currentCategories.includes(category);

    const updatedCategories = isSelected
      ? currentCategories.filter((item: string) => item !== category)
      : [...currentCategories, category];

    const updatedCategoryTitles = isSelected
      ? currentCategoryTitles.filter((item: any) => item.category !== category)
      : [
          ...currentCategoryTitles,
          {
            category,
            titles: [""],
          },
        ];

    updateField("categories", updatedCategories);
    updateField("categoryTitles", updatedCategoryTitles);
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
            updateField("categoryTitles", []);

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
            updateField("categoryTitles", []);
          }}
          disabled={!formData.organizationId}
        />

        {formData.eventId && (
          <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Categories *
            </h3>

            {eventCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {eventCategories.map((category: string) => {
                  const isSelected = (formData.categories || []).includes(
                    category
                  );

                  const titles = getTitlesForCategory(category);

                  return (
                    <div
                      key={category}
                      className="bg-gray-50 border rounded-xl px-3 py-3"
                    >
                      <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleCategory(category)}
                        />
                        <span className="font-medium">{category}</span>
                      </label>

                      {isSelected && (
                        <div className="mt-3 space-y-2 pl-6">
                          {titles.map((title: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                placeholder={`Title ${index + 1}`}
                                value={title}
                                onChange={(e) =>
                                  updateCategoryTitle(
                                    category,
                                    index,
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                              />

                              {titles.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeTitleInput(category, index)
                                  }
                                  className="h-9 w-9 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </div>
                          ))}

                          {titles.length < 2 && (
                            <button
                              type="button"
                              onClick={() => addTitleInput(category)}
                              className="text-sm text-blue-600 flex items-center gap-1 hover:underline"
                            >
                              <Plus size={14} />
                              Add Title
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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