import { useState } from "react";
import { Link } from "react-router-dom";

import { LoadingState, ResultsCount } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { useTopics, useTopicStatus } from "../api";
import { TopicSortSelector } from "../components/TopicSortSelector";
import { TopicCard } from "../components/TopicCard";
import { TriggerTopicModelingButton } from "../components/TriggerTopicModelingButton";

type SortField = "size" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

export function TopicExplorer() {
  const [sortField, setSortField] = useState<SortField>("size");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [extremismFilter, setExtremismFilter] = useState<string | undefined>();

  const { data: topics, isLoading, error } = useTopics({
    params: {
      limit: 100,
      sort_by: sortField,
      order: sortOrder,
      extremism_category: extremismFilter,
    },
  });

  const { data: status } = useTopicStatus({ refetchInterval: 5000 });

  const handleSort = (field: SortField, order: SortOrder) => {
    setSortField(field);
    setSortOrder(order);
  };

  const extremismCategories = [
    { value: undefined, label: "All Categories" },
    { value: "right-wing", label: "Right-Wing" },
    { value: "left-wing", label: "Left-Wing" },
    { value: "islamic", label: "Islamic" },
    { value: "conspiracy", label: "Conspiracy" },
  ];

  return (
    <ContentLayout title="Topic Explorer">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Automatically discovered topics and narratives from message analysis
          </p>
          <TriggerTopicModelingButton />
        </div>

        {/* Status Indicator */}
        {status?.status === "running" && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Topic Modeling in Progress
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    {status.message || "Processing messages to discover newer topics. This may take a few minutes."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Category:
            </label>
            <select
              value={extremismFilter || ""}
              onChange={(e) =>
                setExtremismFilter(e.target.value || undefined)
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {extremismCategories.map((cat) => (
                <option key={cat.value || "all"} value={cat.value || ""}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <LoadingState message="Loading topics…" />
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Error loading topics. Topics may not have been generated yet.
            </p>
          </div>
        ) : !topics || topics.length === 0 ? (
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              No topics found. Run topic modeling to discover topics from your
              messages.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-2 flex w-full items-center justify-end space-x-4">
              <ResultsCount count={topics.length} />
              <TopicSortSelector
                currentSort={{
                  sortBy: sortField,
                  order: sortOrder,
                }}
                onUpdateSort={handleSort}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic) => (
                <TopicCard key={topic.topic_id} topic={topic} />
              ))}
            </div>
          </>
        )}
      </div>
    </ContentLayout>
  );
}
