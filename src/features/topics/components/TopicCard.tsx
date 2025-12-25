import { Link } from "react-router-dom";
import { Topic } from "../api";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "right-wing":
        return "bg-red-100 text-red-800";
      case "left-wing":
        return "bg-blue-100 text-blue-800";
      case "islamic":
        return "bg-green-100 text-green-800";
      case "conspiracy":
        return "bg-purple-100 text-purple-800";
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
      to={`/topics/${topic.topic_id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 shadow hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Topic #{topic.topic_number}
            </h3>
            <p className="text-sm text-gray-500">
              {topic.size} messages
            </p>
          </div>
          {topic.metadata.extremism_category && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(
                topic.metadata.extremism_category
              )}`}
            >
              {topic.metadata.extremism_category}
            </span>
          )}
        </div>

        {/* Top Keywords */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Top Keywords:</p>
          <div className="flex flex-wrap gap-1">
            {topic.top_words.slice(0, 6).map((word, idx) => (
              <span
                key={idx}
                className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                title={`Score: ${topic.top_words_scores[idx]?.toFixed(2)}`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Date Range */}
        {(topic.first_seen || topic.last_seen) && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>First: {formatDate(topic.first_seen)}</span>
              <span>Last: {formatDate(topic.last_seen)}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
