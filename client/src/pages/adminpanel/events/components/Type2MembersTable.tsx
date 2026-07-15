import ReusableMembersTable from "./ReusableMembersTable";
import { type2MemberColumns } from "../utils/type2MemberColumns";

interface Props {
  members: any[];
  loading: boolean;
  isOrderEditing?: boolean;
  orderValues?: Record<string, number>;
  onOrderChange?: (rowKey: string, value: number) => void;
}

export default function Type2MembersTable({
  members,
  loading,
  isOrderEditing = false,
  orderValues = {},
  onOrderChange,
}: Props) {
  // ReusableMembersTable already renders the Order column,
  // so remove it from the configured columns to avoid duplication.
  const tableColumns = type2MemberColumns.filter(
    (column) => column.key !== "order"
  );

  return (
    <ReusableMembersTable
      members={members}
      columns={tableColumns}
      loading={loading}
      isOrderEditing={isOrderEditing}
      orderValues={orderValues}
      onOrderChange={onOrderChange}
    />
  );
}