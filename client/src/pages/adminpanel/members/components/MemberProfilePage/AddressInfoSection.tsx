import Section from "./Section";
import DetailRow from "./DetailRow";
import EditableRow from "./EditableRow";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import { provinceDistrictMap } from "@/data/locationData";

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

export default function AddressInfoSection({
  current,
  editData,
  isEditing,
  updateNested,
}: Props) {
  return (
    <Section title="Address Information">
      {isEditing ? (
        <>
          <EditableRow
            label="Permanent Address"
            value={editData?.address?.permanentAddress}
            onChange={(v) =>
              updateNested("address", "permanentAddress", v)
            }
          />

          <div className="border-b border-gray-100 py-3">
            <p className="text-xs text-gray-400">Province</p>

            <SelectInput
              label="Province"
              size="sm"
              compact
              hideLabel
              value={editData?.address?.province || ""}
              options={Object.keys(provinceDistrictMap)}
              onChange={(value) => {
                updateNested("address", "province", value);
                updateNested("address", "district", "");
              }}
            />
          </div>

          <div className="border-b border-gray-100 py-3">
            <p className="text-xs text-gray-400">District</p>

            <SelectInput
              label="District"
              size="sm"
              compact
              hideLabel
              value={editData?.address?.district || ""}
              options={
                editData?.address?.province
                  ? provinceDistrictMap[editData.address.province] || []
                  : []
              }
              disabled={!editData?.address?.province}
              onChange={(value) =>
                updateNested("address", "district", value)
              }
            />
          </div>

          <EditableRow
            label="Divisional Secretariat"
            value={editData?.address?.divisionalSecretariat}
            onChange={(v) =>
              updateNested("address", "divisionalSecretariat", v)
            }
          />

          <EditableRow
            label="Grama Niladhari Division"
            value={editData?.address?.gramaNiladhariDivision}
            onChange={(v) =>
              updateNested("address", "gramaNiladhariDivision", v)
            }
          />

          <EditableRow
            label="Police Division"
            value={editData?.address?.policeDivision}
            onChange={(v) =>
              updateNested("address", "policeDivision", v)
            }
          />
        </>
      ) : (
        <>
          <DetailRow
            label="Permanent Address"
            value={current.address?.permanentAddress}
          />

          <DetailRow
            label="Province"
            value={current.address?.province}
          />

          <DetailRow
            label="District"
            value={current.address?.district}
          />

          <DetailRow
            label="Divisional Secretariat"
            value={current.address?.divisionalSecretariat}
          />

          <DetailRow
            label="Grama Niladhari Division"
            value={current.address?.gramaNiladhariDivision}
          />

          <DetailRow
            label="Police Division"
            value={current.address?.policeDivision}
          />
        </>
      )}
    </Section>
  );
}