import { ContentLayout } from "components/Layout";
import { ClientList, CreateClient } from "features/clients";

export const Configuration = () => {
  return (
    <ContentLayout title="Configuration">
      <div className="space-y-4">
        <h2 className="mb-4 text-lg font-bold leading-7 sm:truncate sm:text-xl">
          Manage Telegram Accounts
        </h2>
        <p className="text-sm text-gray-600">
          Telegram accounts are shared with everybody in your organization.
          <br />
          Only active accounts will be used for scraping.
        </p>
        <ClientList />
        <CreateClient />
      </div>
    </ContentLayout>
  );
};
