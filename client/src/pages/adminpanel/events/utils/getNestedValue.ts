export default function getNestedValue(
  obj: any,
  path: string
): any {
  if (!obj || !path) return "-";

  const value = path
    .split(".")
    .reduce((current, key) => current?.[key], obj);

  return value === undefined ||
    value === null ||
    value === ""
    ? "-"
    : value;
}