import getNestedValue from "../utils/getNestedValue";

export interface Column {
  group?: string;
  key: string;
  label: string;
  type?: "date" | "number";
  width?: number;
  align?: "left" | "center" | "right";
  sticky?: boolean;
}

interface Props {
  members: any[];
  columns: Column[];
  loading: boolean;
}

export default function ReusableMembersTable({
  members,
  columns,
  loading,
}: Props) {
  const formatValue = (member: any, column: Column) => {
    const value = getNestedValue(member, column.key);

    if (column.type === "date" && value !== "-") {
      return new Date(value).toLocaleDateString();
    }

    return value;
  };

  const getAlignmentClass = (column: Column) => {
    if (column.align === "center") return "text-center";
    if (column.align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="w-full max-w-full border border-gray-200 rounded-xl overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="border-collapse text-left text-sm">
          <thead>
            <tr className="bg-[#F2F2F2]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    minWidth: column.width || 160,
                  }}
                  className={`px-4 py-3 border-b font-medium whitespace-nowrap bg-[#F2F2F2] ${getAlignmentClass(
                    column
                  )}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  Loading members...
                </td>
              </tr>
            ) : members.length > 0 ? (
              members.map((member, index) => (
                <tr
                  key={`${member._id || member.memberId}-${index}`}
                  className="hover:bg-gray-50"
                >
                  {columns.map((column) => {
                    const value = formatValue(member, column);

                    return (
                      <td
                        key={column.key}
                        title={String(value)}
                        style={{
                          minWidth: column.width || 160,
                          maxWidth: column.width || 220,
                        }}
                        className={`px-4 py-3 border-b whitespace-nowrap overflow-hidden text-ellipsis ${getAlignmentClass(
                          column
                        )}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-gray-500 italic"
                >
                  No members found for this category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}