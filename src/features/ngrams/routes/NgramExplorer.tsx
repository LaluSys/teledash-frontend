import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col } from "antd";
import { mdiChartBar, mdiCloudOutline, mdiTable } from "@mdi/js";
import Icon from "@mdi/react";

import { LoadingState, ResultsCount } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { ChatMultiSelect } from "components/Form/ChatMultiSelect";
import { DateRangeFilter } from "components/Form/DateRangeFilter";
import {
  useNgrams,
  useTriggerNgramGeneration,
  type GetNgramsParams,
} from "../api";
import {
  NgramWordCloud,
  NgramBarChart,
  NgramTable,
  NgramConfigForm,
  type NgramConfig,
  TriggerNgramButton,
} from "../components";

type ViewMode = "cloud" | "bar" | "table";

export function NgramExplorer() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("bar");
  const [showConfig, setShowConfig] = useState(false);

  // Filter state
  const [filterChatIds, setFilterChatIds] = useState<string[]>([]);
  const [filterSelectAll, setFilterSelectAll] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState<string | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<string | undefined>();

  const [params, setParams] = useState<GetNgramsParams>({
    n_values: [2, 3],
    min_frequency: 5,
    chat_ids: undefined,
    date_from: undefined,
    date_to: undefined,
  });

  const { data, isLoading, error, refetch } = useNgrams({
    params,
    config: {
      enabled: false, // Don't fetch automatically
    },
  });

  const { mutate: generateNgrams, isPending: isGenerating } =
    useTriggerNgramGeneration({
      config: {
        onSuccess: () => {
          // Refetch n-grams after generation
          setTimeout(() => {
            refetch();
          }, 2000);
        },
      },
    });

  const handleGenerate = (config: NgramConfig) => {
    const generationParams = {
      n_values: config.n_values,
      min_frequency: config.min_frequency,
      stopwords_language: config.stopwords_language,
    };

    // Update params for subsequent queries
    setParams((prev) => ({
      ...prev,
      n_values: config.n_values,
      min_frequency: config.min_frequency,
    }));

    // Trigger generation
    generateNgrams(generationParams);
    setShowConfig(false);
  };

  const handleNgramClick = (ngram: string) => {
    // Navigate to messages page with n-gram search filter
    navigate(`/messages?search=${encodeURIComponent(ngram)}`);
  };

  // Apply filters to query params
  const handleApplyFilters = () => {
    setParams((prev) => ({
      ...prev,
      chat_ids: filterSelectAll ? undefined : filterChatIds,
      date_from: filterDateFrom,
      date_to: filterDateTo,
    }));
    refetch();
  };

  const ngrams = data?.ngrams || [];

  return (
    <ContentLayout title="N-gram Explorer">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Discover frequent word sequences and phrases in your text corpus
          </p>
          <TriggerNgramButton />
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

        {/* Generation Status */}
        {isGenerating && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  N-gram Analysis in Progress
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Processing messages to extract n-grams. This may take a few
                    moments.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle Buttons */}
        {!isLoading && !error && ngrams.length > 0 && (
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode("cloud")}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                  viewMode === "cloud"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon path={mdiCloudOutline} size={0.8} className="mr-1.5" />
                Word Cloud
              </button>
              <button
                onClick={() => setViewMode("bar")}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                  viewMode === "bar"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon path={mdiChartBar} size={0.8} className="mr-1.5" />
                Bar Chart
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ${
                  viewMode === "table"
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon path={mdiTable} size={0.8} className="mr-1.5" />
                Table
              </button>
            </div>
            <ResultsCount count={ngrams.length} />
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <LoadingState message="Loading n-grams..." />
        ) : error ? (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Error loading n-grams. Please try generating n-grams first using
              the configuration panel.
            </p>
          </div>
        ) : ngrams.length === 0 ? (
          <div className="rounded-md bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              No n-grams found. Click "Configure Analysis" to generate n-grams
              from your messages.
            </p>
          </div>
        ) : (
          <>
            {/* Data Info */}
            {data && (
              <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div>
                    <span className="font-medium">Total Documents:</span>{" "}
                    {data.total_documents.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Date Range:</span>{" "}
                    {new Date(data.date_range.from).toLocaleDateString()} -{" "}
                    {new Date(data.date_range.to).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">N-gram Types:</span>{" "}
                    {data.parameters.n_values.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium">Min Frequency:</span>{" "}
                    {data.parameters.min_frequency}
                  </div>
                </div>
              </div>
            )}

            {/* Visualizations */}
            {viewMode === "cloud" && <NgramWordCloud ngrams={ngrams} />}
            {viewMode === "bar" && <NgramBarChart ngrams={ngrams} />}
            {viewMode === "table" && (
              <NgramTable ngrams={ngrams} onNgramClick={handleNgramClick} />
            )}
          </>
        )}
      </div>
    </ContentLayout>
  );
}
