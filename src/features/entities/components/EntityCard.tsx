import { Link } from "react-router-dom";
import { Entity } from "../api";

interface EntityCardProps {
  entity: Entity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const getEntityTypeColor = (type: string) => {
    switch (type) {
      case "PERSON":
        return "bg-blue-100 text-blue-800";
      case "ORG":
        return "bg-purple-100 text-purple-800";
      case "LOC":
        return "bg-green-100 text-green-800";
      case "EVENT":
        return "bg-orange-100 text-orange-800";
      case "MISC":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Link
      to={`/entities/${entity.entity_id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {entity.text}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {entity.frequency} mention{entity.frequency !== 1 ? "s" : ""}
            </p>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getEntityTypeColor(
              entity.entity_type
            )}`}
          >
            {entity.entity_type}
          </span>
        </div>

        {/* Primary Chats */}
        {entity.metadata?.primary_chats && entity.metadata.primary_chats.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Active in {entity.metadata.primary_chats.length} chat{entity.metadata.primary_chats.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Date Range */}
        {(entity.first_seen || entity.last_seen) && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>First: {formatDate(entity.first_seen)}</span>
              <span>Last: {formatDate(entity.last_seen)}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
