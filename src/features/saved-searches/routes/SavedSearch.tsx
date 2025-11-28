import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { LoadingState } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { MessageList } from "features/messages";
import { useSavedSearchesList } from "features/saved-searches";
import {
  FilterContext,
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";

export function SavedSearch() {
  const { savedSearchId } = useParams();
  const savedSearchesQuery = useSavedSearchesList();

  const savedSearch = savedSearchesQuery.data?.find(
    (search) => search.id === savedSearchId,
  );

  const filterId = "savedSearches";
  const filterKey = "messages";
  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);

  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions(filterId),
  );

  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions(filterId, options);
    },
    [setFilterOptions],
  );

  const defaultFilterOptions = useMemo(
    () => ({
      messages: savedSearch?.params,
    }),
    [savedSearch],
  );

  console.count("render");

  if (savedSearchesQuery.isLoading) {
    return (
      <ContentLayout>
        <LoadingState size="sm" message="Loading saved search…" />
      </ContentLayout>
    );
  }

  if (savedSearchesQuery.isError) {
    return (
      <ContentLayout title="Saved search not found">
        <div className="space-y-4">
          <p>
            Saved search with ID <strong>{savedSearchId}</strong> was not found.
          </p>
        </div>
      </ContentLayout>
    );
  }

  if (!savedSearch || !filterOptions) return null;

  return (
    <ContentLayout title={"Saved Search: " + savedSearch.name}>
      <div className="space-y-6">
        <SearchForm
          filterKey={filterKey}
          filterOptions={filterOptions}
          defaultFilterOptions={defaultFilterOptions}
          onFilterUpdate={updateFilters}
        />
        <FilterContext.Provider value={filterId}>
          <MessageList
            queryParams={{
              ...filterOptions?.messages,
              // Hand over saved search id to indicate that a saved search is queried and its last_visited timestamp should be updated.
              saved_search_id: savedSearchId,
            }}
            onUpdateSort={(sortBy, order) => {
              updateFilters({
                key: "messages",
                params: {
                  ...filterOptions.messages,
                  sort_by: sortBy,
                  order: order,
                },
              });
            }}
          />
        </FilterContext.Provider>
      </div>
    </ContentLayout>
  );
}
