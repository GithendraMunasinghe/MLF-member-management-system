import ReusableMembersTable from "./ReusableMembersTable";
import { type1MemberColumns } from "../utils/type1MemberColumns";

interface Props {
  members: any[];
  loading: boolean;
}

export default function Type1MembersTable({
  members,
  loading,
}: Props) {
  return (
    <ReusableMembersTable
      members={members}
      columns={type1MemberColumns}
      loading={loading}
    />
  );
}