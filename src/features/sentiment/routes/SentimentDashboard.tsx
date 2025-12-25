import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Card, Row, Col } from "antd";

import { ContentLayout } from "components/Layout";
import { LoadingState } from "components/Elements";
import { ChatMultiSelect } from "components/Form/ChatMultiSelect";
import { DateRangeFilter } from "components/Form/DateRangeFilter";
import { useSentimentStats, useSentimentTimeline } from "../api";
import {
  SentimentPieChart,
  SentimentTimelineChart,
  SentimentByChatChart,
  TriggerSentimentButton,
} from "../components";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function SentimentDashboard() {
  const [selectedGranularity, setSelectedGranularity] = useState<
    "hour" | "day" | "week" | "month"
  >("day");

  // Filter state
  const [filterChatIds, setFilterChatIds] = useState<string[]>([]);
  const [filterSelectAll, setFilterSelectAll] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState<string | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<string | undefined>();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useSentimentStats({
    params: {
      chat_ids: filterSelectAll ? undefined : filterChatIds,
      date_from: filterDateFrom,
      date_to: filterDateTo,
    },
  });

  const {
    data: timeline,
    isLoading: timelineLoading,
    error: timelineError,
  } = useSentimentTimeline({
    params: { granularity: selectedGranularity },
  });

  if (statsError || timelineError) {
    return (
      <ContentLayout title="Sentiment Analysis">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading sentiment data
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  {statsError?.message ||
                    timelineError?.message ||
                    "An error occurred"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ContentLayout>
    );
  }

  const tabs = ["Overview", "Timeline", "By Chat"];

  // Apply filters to query params
  const handleApplyFilters = () => {
    refetchStats();
  };

  return (
    <ContentLayout title="Sentiment Analysis">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Emotional tone analysis of messages across all chats
          </p>
          <TriggerSentimentButton />
        </div>

        {/* Filter Panel */}
        <Card title="Filters" size="small">
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 12 }}>
                <strong>Filter by Chats</strong>
              </div>
              <ChatMultiSelect
                selectedChatIds={filterChatIds}
                onSelectionChange={setFilterChatIds}
                selectAll={filterSelectAll}
                onSelectAllChange={setFilterSelectAll}
              />
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 12 }}>
                <strong>Filter by Date Range</strong>
              </div>
              <DateRangeFilter
                dateFrom={filterDateFrom}
                dateTo={filterDateTo}
                onChange={(from, to) => {
                  setFilterDateFrom(from);
                  setFilterDateTo(to);
                }}
              />
              <button
                onClick={handleApplyFilters}
                className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Apply Filters
              </button>
            </Col>
          </Row>
        </Card>

        {/* Summary Cards */}
        {stats && !statsLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Total Messages
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stats.total_messages.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Positive
                      </dt>
                      <dd className="text-lg font-semibold text-green-600">
                        {stats.sentiment_breakdown.positive.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Neutral
                      </dt>
                      <dd className="text-lg font-semibold text-gray-600">
                        {stats.sentiment_breakdown.neutral.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="truncate text-sm font-medium text-gray-500">
                        Negative
                      </dt>
                      <dd className="text-lg font-semibold text-red-600">
                        {stats.sentiment_breakdown.negative.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                    "ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white text-blue-700 shadow"
                      : "text-blue-900 hover:bg-white/[0.12] hover:text-blue-800"
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {/* Overview Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-6")}>
              {statsLoading ? (
                <LoadingState message="Loading sentiment statistics..." />
              ) : stats ? (
                <div>
                  <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                    Sentiment Distribution
                  </h3>
                  <SentimentPieChart
                    data={stats.sentiment_breakdown}
                    loading={statsLoading}
                  />
                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                      Average Sentiment Score:{" "}
                      <span
                        className={classNames(
                          "font-semibold",
                          stats.average_score > 0
                            ? "text-green-600"
                            : stats.average_score < 0
                            ? "text-red-600"
                            : "text-gray-600"
                        )}
                      >
                        {stats.average_score.toFixed(2)}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Range: -1.0 (very negative) to +1.0 (very positive)
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No sentiment data available</p>
              )}
            </Tab.Panel>

            {/* Timeline Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-6")}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Sentiment Over Time
                </h3>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-gray-700">
                    Granularity:
                  </label>
                  <select
                    value={selectedGranularity}
                    onChange={(e) =>
                      setSelectedGranularity(
                        e.target.value as "hour" | "day" | "week" | "month"
                      )
                    }
                    className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>
              {timelineLoading ? (
                <LoadingState message="Loading timeline data..." />
              ) : timeline && timeline.data.length > 0 ? (
                <SentimentTimelineChart
                  data={timeline.data}
                  loading={timelineLoading}
                />
              ) : (
                <p className="text-gray-500">No timeline data available</p>
              )}
            </Tab.Panel>

            {/* By Chat Tab */}
            <Tab.Panel className={classNames("rounded-xl bg-white p-6")}>
              <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
                Sentiment by Chat (Top 20)
              </h3>
              {statsLoading ? (
                <LoadingState message="Loading chat statistics..." />
              ) : stats && stats.by_chat.length > 0 ? (
                <SentimentByChatChart
                  data={stats.by_chat}
                  loading={statsLoading}
                />
              ) : (
                <p className="text-gray-500">
                  No per-chat data available
                </p>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ContentLayout>
  );
}
