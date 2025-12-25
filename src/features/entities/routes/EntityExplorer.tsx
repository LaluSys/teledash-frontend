import { useState } from "react";
import { Tab } from "@headlessui/react";
import { Card, Row, Col } from "antd";

import { ContentLayout } from "components/Layout";
import { ChatMultiSelect } from "components/Form/ChatMultiSelect";
import { DateRangeFilter } from "components/Form/DateRangeFilter";
import { EntityList } from "../components/EntityList";
import { EntityNetworkGraph } from "../components/EntityNetworkGraph";
import { TriggerNERButton } from "../components/TriggerNERButton";
import { useEntityNetwork, EntityType } from "../api";
import { LoadingState } from "components/Elements";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function EntityExplorer() {
  // Network graph filters
  const [selectedTypes, setSelectedTypes] = useState<EntityType[]>([]);
  const [minCooccurrence, setMinCooccurrence] = useState<number>(2);
  const [maxNodes, setMaxNodes] = useState<number>(50);

  // Shared filters for both tabs
  const [filterChatIds, setFilterChatIds] = useState<string[]>([]);
  const [filterSelectAll, setFilterSelectAll] = useState(true);
  const [filterDateFrom, setFilterDateFrom] = useState<string | undefined>();
  const [filterDateTo, setFilterDateTo] = useState<string | undefined>();

  const { data: networkData, isLoading: networkLoading } = useEntityNetwork({
    params: {
      chat_ids: filterSelectAll ? undefined : filterChatIds,
      entity_types: selectedTypes.length > 0 ? selectedTypes : undefined,
      min_cooccurrence: minCooccurrence,
      max_nodes: maxNodes,
    },
  });

  const entityTypes: EntityType[] = ["PERSON", "ORG", "LOC", "EVENT", "MISC"];

  const toggleEntityType = (type: EntityType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  return (
    <ContentLayout title="Entity Explorer">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Discover and analyze named entities extracted from messages
          </p>
          <TriggerNERButton />
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
            </Col>
          </Row>
        </Card>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-600 hover:bg-white/[0.12] hover:text-blue-800"
                )
              }
            >
              Entity List
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white text-blue-700 shadow"
                    : "text-blue-600 hover:bg-white/[0.12] hover:text-blue-800"
                )
              }
            >
              Network Graph
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel>
              <EntityList
                chatIds={filterSelectAll ? undefined : filterChatIds}
                dateFrom={filterDateFrom}
                dateTo={filterDateTo}
              />
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-4">
                {/* Network Graph Filters */}
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Network Filters
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Entity Types:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {entityTypes.map((type) => (
                          <button
                            key={type}
                            onClick={() => toggleEntityType(type)}
                            className={classNames(
                              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                              selectedTypes.includes(type)
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Min Co-occurrence:
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={minCooccurrence}
                          onChange={(e) => setMinCooccurrence(parseInt(e.target.value) || 1)}
                          className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-gray-700">
                          Max Nodes:
                        </label>
                        <select
                          value={maxNodes}
                          onChange={(e) => setMaxNodes(parseInt(e.target.value))}
                          className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={150}>150</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Graph */}
                <div className="bg-white p-4 rounded-lg shadow">
                  {networkLoading ? (
                    <LoadingState message="Loading network data..." />
                  ) : networkData ? (
                    <EntityNetworkGraph data={networkData} width={1000} height={700} />
                  ) : (
                    <div className="rounded-md bg-yellow-50 p-4">
                      <p className="text-sm text-yellow-800">
                        No network data available. Try adjusting your filters.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </ContentLayout>
  );
}
