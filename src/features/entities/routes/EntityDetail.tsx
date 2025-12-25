import { useParams, Link } from "react-router-dom";
import { mdiArrowLeft } from "@mdi/js";
import Icon from "@mdi/react";

import { LoadingState } from "components/Elements";
import { ContentLayout } from "components/Layout";
import { useEntity, useEntityMessages, useEntityNetwork } from "../api";
import { EntityNetworkGraph } from "../components/EntityNetworkGraph";

export function EntityDetail() {
  const { entityId } = useParams<{ entityId: string }>();

  const { data: entity, isLoading: entityLoading } = useEntity({
    entityId: entityId!,
  });

  const { data: messages, isLoading: messagesLoading } = useEntityMessages({
    entityId: entityId!,
    params: { limit: 50 },
  });

  const { data: networkData, isLoading: networkLoading } = useEntityNetwork({
    params: {
      max_nodes: 30,
    },
  });

  if (entityLoading) {
    return (
      <ContentLayout title="Entity Details">
        <LoadingState message="Loading entity..." />
      </ContentLayout>
    );
  }

  if (!entity) {
    return (
      <ContentLayout title="Entity Not Found">
        <div className="text-center">
          <p className="text-gray-500">Entity not found</p>
          <Link to="/entities" className="text-indigo-600 hover:text-indigo-500">
            Back to Entities
          </Link>
        </div>
      </ContentLayout>
    );
  }

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

  const highlightEntities = (text: string, entities: any[] = []) => {
    if (!entities || entities.length === 0) return text;

    let result = [];
    let lastIndex = 0;

    // Sort entities by start offset
    const sortedEntities = [...entities].sort((a, b) => a.start_offset - b.start_offset);

    sortedEntities.forEach((ent, idx) => {
      // Add text before entity
      if (ent.start_offset > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {text.substring(lastIndex, ent.start_offset)}
          </span>
        );
      }

      // Add highlighted entity
      const entityText = text.substring(ent.start_offset, ent.end_offset);
      result.push(
        <span
          key={`entity-${idx}`}
          className={`font-semibold ${
            ent.entity_id === entityId ? "bg-yellow-200" : "bg-gray-100"
          } px-1 rounded`}
          title={ent.entity_type}
        >
          {entityText}
        </span>
      );

      lastIndex = ent.end_offset;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      result.push(<span key="text-end">{text.substring(lastIndex)}</span>);
    }

    return result;
  };

  return (
    <ContentLayout title={entity.text}>
      <div className="space-y-6">
        {/* Back Button */}
        <div>
          <Link
            to="/entities"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <Icon path={mdiArrowLeft} size={0.6} className="mr-2" />
            Back to Entities
          </Link>
        </div>

        {/* Entity Overview */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {entity.text}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Mentioned {entity.frequency} time{entity.frequency !== 1 ? "s" : ""}
                </p>
              </div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getEntityTypeColor(
                  entity.entity_type
                )}`}
              >
                {entity.entity_type}
              </span>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entity.first_seen && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    First Seen
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(entity.first_seen).toLocaleString()}
                  </dd>
                </div>
              )}
              {entity.last_seen && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Seen
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(entity.last_seen).toLocaleString()}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Total Mentions
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {entity.frequency}
                </dd>
              </div>
            </div>

            {/* Primary Chats */}
            {entity.metadata?.primary_chats && entity.metadata.primary_chats.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Primary Chats
                </h3>
                <div className="flex flex-wrap gap-2">
                  {entity.metadata.primary_chats.slice(0, 10).map((chatId) => (
                    <Link
                      key={chatId}
                      to={`/chats/${chatId}`}
                      className="inline-flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-800 hover:bg-gray-200"
                    >
                      {chatId}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Network Graph */}
        {networkLoading ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <LoadingState message="Loading network graph..." />
          </div>
        ) : networkData && networkData.nodes.length > 0 ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Co-occurrence Network
            </h3>
            <EntityNetworkGraph data={networkData} width={1000} height={600} />
          </div>
        ) : null}

        {/* Messages */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Messages Mentioning This Entity
          </h3>

          {messagesLoading ? (
            <LoadingState message="Loading messages..." />
          ) : !messages || messages.length === 0 ? (
            <p className="text-gray-500">No messages found for this entity.</p>
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
                    {message.chat_title && (
                      <span className="rounded-full bg-gray-200 px-2 py-1">
                        {message.chat_title}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900">
                    {highlightEntities(message.text, message.entities)}
                  </p>
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
