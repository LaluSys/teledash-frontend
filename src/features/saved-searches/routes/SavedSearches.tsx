import { ContentLayout } from "components/Layout";
import { SavedSearchList } from "features/saved-searches";

export function SavedSearches() {
  return (
    <ContentLayout title="Saved Searches">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Saved searches are only visible to you.
        </p>
        <SavedSearchList />
      </div>
    </ContentLayout>
  );
}
