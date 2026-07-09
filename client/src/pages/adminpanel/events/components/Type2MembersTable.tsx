import ReusableMembersTable from "./ReusableMembersTable";
import { type2MemberColumns } from "../utils/type2MemberColumns";

interface Props {
  members: any[];
  loading: boolean;
}

export default function Type2MembersTable({
  members,
  loading,
}: Props) {
  return (
    <ReusableMembersTable
      members={members}
      columns={type2MemberColumns}
      loading={loading}
    />
  );
}