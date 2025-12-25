import { useState } from "react";
import { LoadingState, ResultsCount } from "components/Elements";
import { useEntities, EntityType } from "../api";
import { EntityCard } from "./EntityCard";
import { EntityTypeFilter } from "./EntityTypeFilter";

interface EntityListProps {
  chatIds?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export function EntityList({ chatIds, dateFrom, dateTo }: EntityListProps) {
  const [entityType, setEntityType] = useState<EntityType | undefined>();
  const [minFrequency, setMinFrequency] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);

  const { data: entities, isLoading, error } = useEntities({
    params: {
      type: entityType,
      min_frequency: minFrequency,
      limit,
      chat_ids: chatIds,
    },
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <EntityTypeFilter
          selectedType={entityType}
          onTypeChange={setEntityType}
        />

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Min Frequency:
          </label>
          <input
            type="number"
            min="1"
            value={minFrequency}
            onChange={(e) => setMinFrequency(parseInt(e.target.value) || 1)}
            className="w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">
            Limit:
          </label>
          <select
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading entities..." />
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">
            Error loading entities. Entity extraction may not have been run yet.
          </p>
        </div>
      ) : !entities || entities.length === 0 ? (
        <div className="rounded-md bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            No entities found. Try adjusting your filters or run entity extraction.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-2 flex w-full items-center justify-end">
            <ResultsCount count={entities.length} />
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {entities.map((entity) => (
              <EntityCard key={entity.entity_id} entity={entity} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
