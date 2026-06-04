import TextInput from "@/components/adminpanel/inputs/TextInput";
import SelectInput from "@/components/adminpanel/inputs/SelectInput";
import { provinceDistrictMap } from "@/data/locationData";

interface Props {
  formType: "type1" | "type2";
  province: string;
  setProvince: (value: string) => void;
  setDistrict: (value: string) => void;
  updateNestedField: (section: string, field: string, value: any) => void;
}

export default function AddressStep({
  formType,
  province,
  setProvince,
  setDistrict,
  updateNestedField,
}: Props) {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Permanent Address *"
          onChange={(val) =>
            updateNestedField("address", "permanentAddress", val)
          }
        />

        <SelectInput
          label="Province *"
          options={Object.keys(provinceDistrictMap)}
          onChange={(value: string) => {
            setProvince(value);
            setDistrict("");

            updateNestedField("address", "province", value);
            updateNestedField("address", "district", "");
          }}
        />

        <SelectInput
          label="District *"
          options={province ? provinceDistrictMap[province] : []}
          disabled={!province}
          onChange={(value: string) => {
            setDistrict(value);
            updateNestedField("address", "district", value);
          }}
        />

        <TextInput
          label="Divisional Secretariat *"
          onChange={(val) =>
            updateNestedField("address", "divisionalSecretariat", val)
          }
        />

        <TextInput
          label="Grama Niladhari Division *"
          onChange={(val) =>
            updateNestedField("address", "gramaNiladhariDivision", val)
          }
        />

        {formType === "type2" && (
          <TextInput
            label="Police Division *"
            onChange={(val) =>
              updateNestedField("address", "policeDivision", val)
            }
          />
        )}
      </div>
    </>
  );
}