import {
  mdiAlarmLightOutline,
  mdiChartLine,
  mdiCloseCircle,
  mdiInformation,
  mdiLink,
  mdiOpenInNew,
  mdiPodium,
  mdiTagOutline,
  mdiTelevisionAmbientLight,
} from "@mdi/js";
import clsx from "clsx";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  ActivityChart,
  AttachmentTypesTrendList,
  Badge,
  Box,
  Button,
  FormattedMetricNumber,
  GrowthChart,
  ListBox,
  LoadingState,
  RatingIndicator,
  SearchQueryTrendList,
} from "components/Elements";
import { ContentLayout } from "components/Layout";
import {
  ChatLink,
  createChatBadgesArray,
  createDisplayNameFromChat,
  useChat,
} from "features/chats";
import { AddChat } from "features/clients";
import { MessageList, useMessagesStats } from "features/messages";
import {
  FilterContext,
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";
import { formatNumber } from "utils/formatNumber";

import Icon from "@mdi/react";
import { ChatTags } from "features/chats";
import { MessageAttachmentType } from "types";

export const Chat = () => {
  const { chatId } = useParams() as { chatId: string };
  const chatQuery = useChat({ chatId });

  const filterId = `chat-filter-${chatId}`;
  const filterKey = "messages";
  const createFilter = useFilterStore((state) => state.createFilter);
  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);

  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions(filterId),
  );

  if (!filterOptions) {
    createFilter({
      id: filterId,
      options: {
        messages: {
          chat_ids: [Number(chatId)],
        },
      },
    });
  }

  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions(filterId, options);
    },
    [filterId, setFilterOptions],
  );

  const defaultFilterOptions = useMemo(
    () => ({ messages: { chat_ids: [Number(chatId)] } }),
    [chatId],
  );

  const yesterday = useMemo(() => {
    return (
      new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        // Remove time units smaller than minutes
        .slice(0, 16)
    );
  }, []);

  const { data: messagesStats } = useMessagesStats({
    params: { chat_ids: [Number(chatId)] },
  });

  const { data: messagesStatsToday } = useMessagesStats({
    params: {
      date_from: yesterday,
      chat_ids: [Number(chatId)],
    },
  });

  const [isShowingInfo, setIsShowingInfo] = useState(false);
  const [isShowingStats, setIsShowingStats] = useState(false);
  const [isShowingTrends, setIsShowingTrends] = useState(false);

  if (chatQuery.isLoading) {
    return (
      <ContentLayout>
        <LoadingState size="sm" message="Loading chat…" />
      </ContentLayout>
    );
  }

  if (chatQuery.isError) {
    return (
      <ContentLayout title="Chat not found">
        <div className="space-y-4">
          <p>
            No data has been collected for the chat with ID{" "}
            <strong>{chatId}</strong> yet.
          </p>
          <AddChat chat_id={Number(chatId)} />
        </div>
      </ContentLayout>
    );
  }

  if (!chatQuery.data) return null;

  const chat = chatQuery.data;
  const badgesArray = createChatBadgesArray(chat);
  const messageCountLastDay = chat.metrics?.activity_last_day?.sum;
  const messageCountTotal = chat.metrics?.activity_total?.sum;
  const membersGrowthLastDay = chat.metrics?.growth_last_day?.diff;
  const membersCountTotal = chat.members_count;
  const tags = chat.tags;

  const hasStats =
    !!(chat.metrics?.activity_total ?? chat.metrics?.growth_total) ||
    (messageCountLastDay != null && messageCountTotal != null) ||
    (membersGrowthLastDay != null && membersCountTotal != null);

  const hasTrends =
    messagesStats?.extracted_hashtags ??
    messagesStatsToday?.extracted_hashtags ??
    messagesStats?.extracted_domains ??
    messagesStatsToday?.extracted_domains ??
    messagesStats?.attachment_types ??
    messagesStatsToday?.attachment_types ??
    chat.similar_channels ??
    chat.classification_aggregated?.score_pos_avg != null;

  return (
    <ContentLayout
      title={createDisplayNameFromChat(chat)}
      titleExtra={
        badgesArray.length > 0 && (
          <div className="flex flex-nowrap items-center space-x-2">
            {badgesArray.map(({ label, variant }) => (
              <Badge
                key={label}
                label={label}
                variant={variant}
                size="lg"
                className="text-[0.9em]"
              />
            ))}
          </div>
        )
      }
    >
      {filterOptions ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Icon path={mdiTagOutline} size={0.8} className="text-gray-500" />
            <span className="font-bold text-gray-500">Tags</span>
            <ChatTags chatId={chat.id} tags={tags} variant="purple" />
          </div>

          <div className="flex gap-2">
            <Button
              size="xs"
              startIcon={isShowingInfo ? mdiCloseCircle : mdiInformation}
              variant={isShowingInfo ? "secondaryActive" : "secondary"}
              onClick={() => setIsShowingInfo((isShowing) => !isShowing)}
            >
              Info
            </Button>
            {hasStats && (
              <Button
                size="xs"
                startIcon={isShowingStats ? mdiCloseCircle : mdiChartLine}
                variant={isShowingStats ? "secondaryActive" : "secondary"}
                onClick={() => setIsShowingStats((isShowing) => !isShowing)}
              >
                Stats
              </Button>
            )}
            {hasTrends && (
              <Button
                size="xs"
                startIcon={isShowingTrends ? mdiCloseCircle : mdiPodium}
                variant={isShowingTrends ? "secondaryActive" : "secondary"}
                onClick={() => setIsShowingTrends((isShowing) => !isShowing)}
              >
                Trends
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {isShowingInfo && (
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {chat.username && (
                  <Button
                    as="externalLink"
                    variant="secondary"
                    size="xs"
                    startIcon={mdiOpenInNew}
                    href={"https://t.me/" + chat.username}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="w-full sm:w-auto"
                  >
                    @{chat.username}
                  </Button>
                )}
                {chat.linked_chat && (
                  <Button
                    as="link"
                    variant="secondary"
                    size="xs"
                    startIcon={mdiLink}
                    to={"../chat/" + chat.linked_chat.id}
                    className="w-full sm:w-auto"
                  >
                    Linked Chat ({createDisplayNameFromChat(chat.linked_chat)})
                  </Button>
                )}
              </div>
            )}

            {(isShowingInfo || isShowingStats) && (
              <div
                className={clsx(
                  "grid grid-cols-1 gap-4",
                  isShowingInfo
                    ? isShowingStats
                      ? "lg:grid-cols-[3fr_minmax(min-content,_1fr)_minmax(min-content,_1fr)]"
                      : "lg:grid-cols-1"
                    : "lg:grid-cols-[minmax(min-content,_1fr)_minmax(min-content,_1fr)]",
                )}
              >
                {isShowingInfo && (
                  <Box
                    title="Description"
                    className={clsx("whitespace-pre-wrap text-sm")}
                  >
                    {/* If description is "", the fallback is supposed to be used. */}
                    {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                    {chat.description || (
                      <p className="italic text-gray-500">No description</p>
                    )}
                  </Box>
                )}

                {isShowingStats &&
                  messageCountLastDay != null &&
                  messageCountTotal != null && (
                    <Box title="Message Activity (last 24h)">
                      <div className="text-3xl">
                        <FormattedMetricNumber value={messageCountLastDay} />
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(messageCountTotal)} messages total
                      </div>
                    </Box>
                  )}

                {isShowingStats &&
                  membersGrowthLastDay != null &&
                  membersCountTotal != null && (
                    <Box title="Member Growth (last 24h)">
                      <div className="text-3xl">
                        <FormattedMetricNumber value={membersGrowthLastDay} />
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatNumber(membersCountTotal)} members total
                      </div>
                    </Box>
                  )}
              </div>
            )}

            {isShowingStats &&
              !!(
                chat.metrics?.activity_total ?? chat.metrics?.growth_total
              ) && (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {chat.metrics?.activity_total && (
                    <Box title="Message Activity">
                      <div className="h-80">
                        <ActivityChart metric={chat.metrics?.activity_total} />
                      </div>
                    </Box>
                  )}

                  {chat.metrics?.growth_total && (
                    <Box title="Member Growth">
                      <div className="h-80">
                        <GrowthChart metric={chat.metrics?.growth_total} />
                      </div>
                    </Box>
                  )}
                </div>
              )}

            {isShowingTrends && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {messagesStats?.extracted_hashtags && (
                  <SearchQueryTrendList
                    title="Hashtags"
                    items={messagesStats.extracted_hashtags}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          search_query: item.value,
                          search_type: "exact",
                        },
                      })
                    }
                  />
                )}

                {messagesStatsToday?.extracted_hashtags && (
                  <SearchQueryTrendList
                    title="Hashtags (24h)"
                    items={messagesStatsToday.extracted_hashtags}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          search_query: item.value,
                          search_type: "exact",
                        },
                      })
                    }
                  />
                )}

                {messagesStats?.extracted_domains && (
                  <SearchQueryTrendList
                    title="Domains"
                    items={messagesStats.extracted_domains}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          search_query: item.value,
                        },
                      })
                    }
                  />
                )}

                {messagesStatsToday?.extracted_domains && (
                  <SearchQueryTrendList
                    title="Domains (24h)"
                    items={messagesStatsToday.extracted_domains}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          search_query: item.value,
                        },
                      })
                    }
                  />
                )}

                {messagesStats?.attachment_types && (
                  <AttachmentTypesTrendList
                    title="Attachment Types"
                    items={messagesStats.attachment_types}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          attachment_type: item.value as MessageAttachmentType,
                        },
                      })
                    }
                  />
                )}

                {messagesStatsToday?.attachment_types && (
                  <AttachmentTypesTrendList
                    title="Attachment Types (24h)"
                    items={messagesStatsToday.attachment_types}
                    onItemClick={(item) =>
                      updateFilters({
                        key: "messages",
                        params: {
                          ...filterOptions.messages,
                          attachment_type: item.value as MessageAttachmentType,
                        },
                      })
                    }
                  />
                )}

                {chat.similar_channels && (
                  <ListBox
                    startIcon={mdiTelevisionAmbientLight}
                    title="Similar Channels"
                    items={chat.similar_channels}
                  >
                    {(channel) => {
                      return (
                        <li
                          className="truncate font-medium"
                          key={channel.id}
                          title={channel.title ?? undefined}
                        >
                          <ChatLink chat={channel} />
                        </li>
                      );
                    }}
                  </ListBox>
                )}

                {chat.classification_aggregated?.score_pos_avg != null && (
                  <Box
                    startIcon={mdiAlarmLightOutline}
                    title="Classification Score"
                    className="h-fit"
                  >
                    <RatingIndicator
                      rating={chat.classification_aggregated.score_pos_avg}
                      size="lg"
                      description="The percentage of messages flagged by the active classifier."
                    />
                  </Box>
                )}
              </div>
            )}
          </div>

          {/* Messages */}
          <h2 className="text-xl font-bold leading-7 sm:text-2xl">Messages</h2>
          <div className="space-y-6">
            <SearchForm
              filterKey={filterKey}
              filterOptions={filterOptions}
              defaultFilterOptions={defaultFilterOptions}
              onFilterUpdate={updateFilters}
            />
            <FilterContext.Provider value={filterId}>
              <MessageList
                queryParams={filterOptions.messages}
                onUpdateSort={(sortBy, order) => {
                  updateFilters({
                    key: "messages",
                    params: {
                      ...filterOptions.messages,
                      sort_by: sortBy,
                      order: order,
                    },
                  });
                }}
              />
            </FilterContext.Provider>
          </div>
        </div>
      ) : (
        <LoadingState size="sm" message="Loading messages…" />
      )}
    </ContentLayout>
  );
};
