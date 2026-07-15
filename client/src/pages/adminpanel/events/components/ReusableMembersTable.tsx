import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
  isOrderEditing?: boolean;
  orderValues?: Record<string, number>;
  onOrderChange?: (rowKey: string, value: number) => void;
}

const ROWS_PER_PAGE = 10;

const getRowKey = (member: any) =>
  `${member.memberId || member._id}::${member.title || ""}`;

export default function ReusableMembersTable({
  members,
  columns,
  loading,
  isOrderEditing = false,
  orderValues = {},
  onOrderChange,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil(members.length / ROWS_PER_PAGE)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [members]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMembers = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;

    return members.slice(
      startIndex,
      startIndex + ROWS_PER_PAGE
    );
  }, [members, currentPage]);

  const formatValue = (member: any, column: Column) => {
    const value = getNestedValue(member, column.key);

    if (column.type === "date" && value !== "-") {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        return "-";
      }

      return date.toLocaleDateString();
    }

    return value;
  };

  const getAlignmentClass = (column: Column) => {
    if (column.align === "center") return "text-center";
    if (column.align === "right") return "text-right";

    return "text-left";
  };

  const startRow =
    members.length === 0
      ? 0
      : (currentPage - 1) * ROWS_PER_PAGE + 1;

  const endRow = Math.min(
    currentPage * ROWS_PER_PAGE,
    members.length
  );

  return (
    <div className="w-full max-w-full">
      <div className="w-full max-w-full border border-gray-200 rounded-xl overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#F2F2F2]">
                <th
                  style={{ minWidth: 110 }}
                  className="px-4 py-3 border-b font-medium whitespace-nowrap bg-[#F2F2F2] text-center"
                >
                  Order
                </th>

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
                    colSpan={columns.length + 1}
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    Loading members...
                  </td>
                </tr>
              ) : paginatedMembers.length > 0 ? (
                paginatedMembers.map((member, index) => {
                  const rowKey = getRowKey(member);
                  const displayedOrder =
                    orderValues[rowKey] ?? member.order ?? startRow + index;

                  return (
                    <tr
                      key={`${rowKey}-${currentPage}-${index}`}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 border-b text-center">
                        {isOrderEditing ? (
                          <input
                            type="number"
                            min={1}
                            max={members.length}
                            value={displayedOrder}
                            onChange={(e) => {
                              const value = Number(e.target.value);

                              if (
                                Number.isInteger(value) &&
                                value > 0
                              ) {
                                onOrderChange?.(rowKey, value);
                              }
                            }}
                            className="w-20 px-2 py-1.5 border rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          displayedOrder
                            .toString()
                            .padStart(3, "0")
                        )}
                      </td>

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
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
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

      {!loading && members.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 px-1">
          <p className="text-sm text-gray-500">
            Showing {startRow} to {endRow} of {members.length} rows
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
            >
              Previous
            </Button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`h-8 min-w-8 rounded-lg px-2 text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-[#1c1c1c] text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}