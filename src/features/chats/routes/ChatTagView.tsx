import { useState } from "react";
import { Link } from "react-router-dom";

import { LoadingState, ResultsCount } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { useChatsStats } from "features/chats";
import { TagSortBy, TagSortSelector } from "features/tags";
import { OrderEnum } from "types";

export function ChatTagView() {
  const { data: chatsStats, isLoading } = useChatsStats();
  const [sortField, setSortField] = useState<TagSortBy>("count");
  const [sortOrder, setSortOrder] = useState<OrderEnum>("desc");

  const tags = chatsStats?.tags || [];

  const sortedTags = [...tags].sort((a, b) => {
    if (sortField === "name") {
      const comparison = a.value.localeCompare(b.value);
      return sortOrder === "asc" ? comparison : -comparison;
    } else {
      const comparison = a.count - b.count;
      return sortOrder === "asc" ? comparison : -comparison;
    }
  });

  const handleSort = (sortBy: TagSortBy, order: OrderEnum) => {
    setSortField(sortBy);
    setSortOrder(order);
  };

  return (
    <ContentLayout title="Chat Tags">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Browse chats by tags. Click a tag to see all chats in that category.
        </p>
        {isLoading ? (
          <LoadingState message="Loading chat tags…" />
        ) : tags.length === 0 ? (
          <div>No tags found.</div>
        ) : (
          <>
            <div className="mb-2 flex w-full items-center justify-end space-x-4">
              <ResultsCount count={tags.length} />
              <TagSortSelector
                currentSort={{
                  sortBy: sortField,
                  order: sortOrder,
                }}
                onUpdateSort={handleSort}
              />
            </div>
            <div className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
              <ul className="divide-y divide-gray-200">
                {sortedTags.map((tag) => (
                  <li
                    key={tag.value}
                    className="flex h-14 w-full items-center justify-between px-4 py-2 font-medium sm:px-6 sm:first:rounded-t-lg sm:last:rounded-b-lg"
                  >
                    <div className="truncate">
                      <Link
                        to="/search/chats"
                        className="hover:underline"
                        state={{
                          defaultFilterOptions: {
                            chats: {
                              tags: [tag.value],
                            },
                          },
                        }}
                      >
                        {tag.value}
                      </Link>
                    </div>
                    <span className="ml-4 flex-shrink-0">{tag.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </ContentLayout>
  );
}
