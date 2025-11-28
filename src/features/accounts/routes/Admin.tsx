import { ContentLayout } from "components/Layout";
import { AccountList } from "features/accounts";
import { useUser } from "lib/auth";

export const Admin = () => {
  const user = useUser();

  // TODO: Implement proper route protection with forbidden messages etc.
  if (user.data?.is_superuser === false) return null;

  return (
    <ContentLayout title="Administration">
      <h2 className="mb-4 text-lg font-bold leading-7 sm:truncate sm:text-xl">
        Manage Teledash Accounts
      </h2>
      <AccountList />
    </ContentLayout>
  );
};
