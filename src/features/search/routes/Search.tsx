import { startCase } from "lodash";
import { useCallback } from "react";
import { useLocation } from "react-router-dom";

import { ContentLayout } from "components/Layout";
import { ChatList } from "features/chats";
import { MessageList } from "features/messages";
import {
  FilterContext,
  FilterKeys,
  UpdateFiltersOptions,
  SearchForm,
  FilterOptions,
  useFilterStore,
} from "features/search";
import { UserList } from "features/users";

type SearchLocationState = {
  defaultFilterOptions?: FilterOptions;
};

type SearchOptions = {
  filterKey: FilterKeys;
};

export const Search = ({ filterKey }: SearchOptions) => {
  const location = useLocation();
  const locationState = location.state as SearchLocationState | undefined;

  const filterId = "search";

  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions(filterId),
  );

  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);

  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions(filterId, options);
    },
    [setFilterOptions],
  );

  console.count("render");

  if (!filterOptions) return null;

  return (
    <ContentLayout title={"Search for " + startCase(filterKey)}>
      <div className="space-y-4">
        <SearchForm
          filterKey={filterKey}
          filterOptions={filterOptions}
          defaultFilterOptions={locationState?.defaultFilterOptions}
          onFilterUpdate={updateFilters}
        />

        {filterKey === "chats" && (
          <ChatList
            queryParams={filterOptions.chats}
            onUpdateSort={(sortBy, order) => {
              updateFilters({
                key: "chats",
                params: {
                  ...filterOptions.chats,
                  sort_by: sortBy,
                  order: order,
                },
              });
            }}
          />
        )}

        {filterKey === "messages" && (
          // Used by MessageTags
          <FilterContext.Provider value={filterId}>
            <MessageList
              queryParams={filterOptions.messages}
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
        )}

        {filterKey === "users" && (
          <UserList
            queryParams={filterOptions.users}
            onUpdateSort={(sortBy, order) => {
              updateFilters({
                key: "users",
                params: {
                  ...filterOptions.users,
                  sort_by: sortBy,
                  order: order,
                },
              });
            }}
          />
        )}
      </div>
    </ContentLayout>
  );
};
