import { useState } from "react";
import { API_URL } from "@/config/api";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import DetailRow from "./DetailRow";
import { Plus, X } from "lucide-react";

interface Props {
  current: any;
  editData: any;
  isEditing: boolean;
  coordinators: any[];
  setEditData: React.Dispatch<React.SetStateAction<any>>;
  toggleCategory: (category: string) => void;
  getTitlesForCategory: (category: string) => string[];
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
  updateCategoryTitle: (
    category: string,
    titleIndex: number,
    value: string
  ) => void;
  addCategoryTitle: (category: string) => void;
  removeCategoryTitle: (category: string, titleIndex: number) => void;
}

export default function MemberProfileSidebar({
  current,
  editData,
  isEditing,
  coordinators,
  setEditData,
  toggleCategory,
  getTitlesForCategory,
  setPhotoFile,
  updateCategoryTitle,
  addCategoryTitle,
  removeCategoryTitle,
}: Props) {
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const photoUrl = previewPhoto
    ? previewPhoto
    : current?.photo
    ? `${API_URL}${current.photo}`
    : null;

  const getEditableTitlesForCategory = (category: string) => {
    const categoryTitle = editData?.categoryTitles?.find(
      (item: any) => item.category === category
    );

    return categoryTitle?.titles || [""];
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 h-fit lg:sticky lg:top-6 text-center">
      <div className="w-36 h-36 rounded-full bg-gray-100 border mx-auto overflow-hidden flex items-center justify-center">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Member"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl font-semibold text-gray-400">
            {current.personalInfo?.certificateName?.charAt(0) || "M"}
          </span>
        )}
      </div>

      {isEditing && (
        <div className="mt-3">
          <label className="text-xs text-blue-600 cursor-pointer hover:underline">
            Change Profile Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setPhotoFile(file);
                  setPreviewPhoto(URL.createObjectURL(file));
                }
              }}
            />
          </label>
        </div>
      )}

      <h1 className="text-xl font-semibold text-gray-800 mt-4">
        {current.personalInfo?.certificateName ||
          current.personalInfo?.fullName ||
          "-"}
      </h1>

      <p className="text-sm text-gray-500 mt-1">{current.regNo}</p>

      <div className="mt-5 text-left space-y-3">
        <DetailRow label="Organization" value={current.organizationId?.name} />

        <DetailRow label="Event" value={current.eventId?.name} />

        <div className="border-b border-gray-100 py-3">
          <p className="text-xs text-gray-400">Categories & Titles</p>

          {isEditing ? (
            <div className="flex flex-col gap-3 mt-2">
              {(editData?.eventId?.categories || []).map((category: string) => {
                const isSelected = (editData?.categories || []).includes(
                  category
                );

                const titles = getEditableTitlesForCategory(category);

                return (
                  <div key={category} className="border rounded-lg p-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategory(category)}
                      />
                      {category}
                    </label>

                    {isSelected && (
                      <div className="mt-2 space-y-2 pl-5">
                        {titles.map((title: string, index: number) => (
                          <div key={index} className="flex gap-2">
                            <input
                              type="text"
                              value={title}
                              placeholder={`Title ${index + 1}`}
                              onChange={(e) =>
                                updateCategoryTitle(
                                  category,
                                  index,
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1.5 border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {titles.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removeCategoryTitle(category, index)
                                }
                                className="h-8 w-8 border rounded-lg flex items-center justify-center hover:bg-gray-100"
                              >
                                <X size={13} />
                              </button>
                            )}
                          </div>
                        ))}

                        {titles.length < 2 && (
                          <button
                            type="button"
                            onClick={() => addCategoryTitle(category)}
                            className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                          >
                            <Plus size={13} />
                            Add Title
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : current.categories && current.categories.length > 0 ? (
            <div className="mt-2 space-y-3">
              {current.categories.map((category: string) => {
                const titles = getTitlesForCategory(category);

                return (
                  <div key={category}>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      {category}
                    </span>

                    {titles.length > 0 && (
                      <ul className="mt-2 ml-4 list-disc text-xs text-gray-600 space-y-1">
                        {titles.map((title, index) => (
                          <li key={index}>{title}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-700">-</p>
          )}
        </div>

        <div className="border-b border-gray-100 py-3">
          <p className="text-xs text-gray-400">Coordinator</p>

          {isEditing ? (
            <SelectInput
              label="Coordinator"
              hideLabel
              size="sm"
              compact
              value={editData?.coordinatorId?._id || ""}
              options={coordinators.map((coordinator) => ({
                label: coordinator.name,
                value: coordinator._id,
              }))}
              onChange={(value) => {
                const selected = coordinators.find((c) => c._id === value);

                setEditData((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        coordinatorId: selected
                          ? {
                              _id: selected._id,
                              name: selected.name,
                              coordinatorId: selected.coordinatorId,
                            }
                          : undefined,
                      }
                    : prev
                );
              }}
            />
          ) : (
            <p className="text-sm font-medium text-gray-700">
              {current.coordinatorId?.name || "-"}
            </p>
          )}
        </div>

        <DetailRow
          label="Registered Date"
          value={
            current.createdAt
              ? new Date(current.createdAt).toLocaleDateString()
              : "-"
          }
        />
      </div>
    </div>
  );
}