import { EntityType } from "../api";

interface EntityTypeFilterProps {
  selectedType?: EntityType;
  onTypeChange: (type: EntityType | undefined) => void;
}

const ENTITY_TYPES: Array<{ value: EntityType | undefined; label: string }> = [
  { value: undefined, label: "All Types" },
  { value: "PERSON", label: "Person" },
  { value: "ORG", label: "Organization" },
  { value: "LOC", label: "Location" },
  { value: "EVENT", label: "Event" },
  { value: "MISC", label: "Miscellaneous" },
];

export function EntityTypeFilter({
  selectedType,
  onTypeChange,
}: EntityTypeFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-gray-700">
        Entity Type:
      </label>
      <select
        value={selectedType || ""}
        onChange={(e) =>
          onTypeChange((e.target.value as EntityType) || undefined)
        }
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        {ENTITY_TYPES.map((type) => (
          <option key={type.value || "all"} value={type.value || ""}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}
