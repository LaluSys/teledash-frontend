import { useParams, Link } from "react-router-dom";
import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";

import { LoadingState } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { useTopic, useTopicMessages } from "../api";

export function TopicDetail() {
  const { topicId } = useParams<{ topicId: string }>();

  const { data: topic, isLoading: topicLoading } = useTopic({
    topicId: topicId!,
  });

  const { data: messages, isLoading: messagesLoading } = useTopicMessages({
    topicId: topicId!,
    params: { limit: 50 },
  });

  if (topicLoading) {
    return (
      <ContentLayout title="Topic Details">
        <LoadingState message="Loading topic..." />
      </ContentLayout>
    );
  }

  if (!topic) {
    return (
      <ContentLayout title="Topic Not Found">
        <div className="text-center">
          <p className="text-gray-500">Topic not found</p>
          <Link to="/topics" className="text-indigo-600 hover:text-indigo-500">
            Back to Topics
          </Link>
        </div>
      </ContentLayout>
    );
  }

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

  return (
    <ContentLayout title={`Topic #${topic.topic_number}`}>
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link
            to="/topics"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Icon path={mdiArrowLeft} size={0.6} className="mr-2" />
            Back to Topics
          </Link>
        </div>

        {/* Topic Overview */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Topic #{topic.topic_number}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {topic.size} messages assigned to this topic
                </p>
              </div>
              {topic.metadata.extremism_category && (
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(
                    topic.metadata.extremism_category
                  )}`}
                >
                  {topic.metadata.extremism_category}
                </span>
              )}
            </div>

            {/* Top Keywords */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Top Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {topic.top_words.map((word, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                    title={`Score: ${topic.top_words_scores[idx]?.toFixed(3)}`}
                  >
                    {word}
                    <span className="ml-2 text-xs text-indigo-600">
                      {topic.top_words_scores[idx]?.toFixed(2)}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topic.first_seen && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    First Seen
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(topic.first_seen).toLocaleString()}
                  </dd>
                </div>
              )}
              {topic.last_seen && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Seen
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(topic.last_seen).toLocaleString()}
                  </dd>
                </div>
              )}
              {topic.coherence_score && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Coherence Score
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {topic.coherence_score.toFixed(3)}
                  </dd>
                </div>
              )}
            </div>

            {/* Primary Channels */}
            {topic.metadata.primary_channels.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Primary Channels
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topic.metadata.primary_channels.slice(0, 5).map((channelId) => (
                    <Link
                      key={channelId}
                      to={`/chats/${channelId}`}
                      className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
                    >
                      {channelId}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Sample Messages
          </h3>

          {messagesLoading ? (
            <LoadingState message="Loading messages..." />
          ) : !messages || messages.length === 0 ? (
            <p className="text-gray-500">No messages found for this topic.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border-l-4 border-indigo-400 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {new Date(message.date).toLocaleString()}
                    </span>
                    {message.topic_probability && (
                      <span className="rounded-full bg-indigo-100 px-2 py-1 text-indigo-800">
                        {(message.topic_probability * 100).toFixed(0)}%
                        confidence
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900">{message.text}</p>
                  <div className="mt-2">
                    <Link
                      to={`/chats/${message.chat_id}`}
                      className="text-xs text-indigo-600 hover:text-indigo-500"
                    >
                      View in chat →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
}
