import * as XLSX from "xlsx";
import getNestedValue from "./getNestedValue";
import type { Column } from "../components/ReusableMembersTable";

interface ExportMembersToExcelParams {
  members: any[];
  columns: Column[];
  eventName: string;
  category: string;
}

const formatCellValue = (member: any, column: Column) => {
  const value = getNestedValue(member, column.key);

  // Export empty values as "-"
  if (
    value === "-" ||
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "-";
  }

  if (column.type === "date") {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString();
  }

  return value;
};

const sanitizeFileName = (value: string) => {
  return value
    .trim()
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_");
};

export default function exportMembersToExcel({
  members,
  columns,
  eventName,
  category,
}: ExportMembersToExcelParams) {
  if (members.length === 0) {
    throw new Error("No member data available to export.");
  }

  const rows = members.map((member) => {
    const row: Record<string, any> = {};

    columns.forEach((column) => {
      row[column.label] = formatCellValue(member, column);
    });

    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = columns.map((column) => ({
    wch: Math.max(
      12,
      Math.min(
        40,
        Math.round((column.width || 160) / 8)
      )
    ),
  }));

  const workbook = XLSX.utils.book_new();

  const sheetName = category.slice(0, 31) || "Members";

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName
  );

  const fileName = `${sanitizeFileName(
    eventName
  )}_${sanitizeFileName(category)}_Members.xlsx`;

  XLSX.writeFile(workbook, fileName);
}