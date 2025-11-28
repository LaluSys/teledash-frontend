import { mdiAlarmLightOutline, mdiCounter } from "@mdi/js";
import { startCase } from "lodash";
import { useMemo } from "react";

import {
  ActivityChart,
  AttachmentTypesTrendList,
  Box,
  GrowthChart,
  RatingIndicator,
  SavedSearchesMessagesCountTrendList,
  SearchQueryTrendList,
  StatsEntryTrendList,
  TagsTrendList,
} from "components/Elements";
import { ContentLayout } from "components/Layout";
import { useListMetrics } from "features/global-metrics";
import { useMessagesStats } from "features/messages";
import {
  useCountUnreadMessages,
  useSavedSearchesList,
} from "features/saved-searches";

export const Dashboard = () => {
  const yesterday = useMemo(() => {
    return (
      new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        // Remove time units smaller than minutes
        .slice(0, 16)
    );
  }, []);

  const { data: messagesStats } = useMessagesStats();

  const { data: messagesStatsToday } = useMessagesStats({
    params: {
      date_from: yesterday,
    },
  });

  const { data: savedSearches } = useSavedSearchesList();
  const { data: messagesCountDict } = useCountUnreadMessages();

  const { data: globalMetrics } = useListMetrics();

  const {
    growth_total,
    activity_total,
    classification_total,
    ...globalCounts
  } = globalMetrics ?? {};

  return (
    <ContentLayout title="Dashboard">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Message Activity */}
          {activity_total && (
            <Box title="Global Message Activity" className="w-full">
              <div className="h-80">
                <ActivityChart metric={activity_total} />
              </div>
            </Box>
          )}
          {growth_total && (
            <Box title="Global Member Growth" className="w-full">
              <div className="h-80">
                <GrowthChart metric={growth_total} />
              </div>
            </Box>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Global Counts */}
          {Object.values(globalCounts).some((value) => value != null) && (
            <StatsEntryTrendList
              startIcon={mdiCounter}
              title="Global Count"
              items={Object.entries(globalCounts)
                .map(([key, value]) => ({
                  value: startCase(key.split("_")[0]),
                  count: value!,
                }))
                .sort((a, b) => b.count - a.count)}
            />
          )}
          {/* Trends for saved searches */}
          {savedSearches && savedSearches.length > 0 && messagesCountDict && (
            <SavedSearchesMessagesCountTrendList
              savedSearches={savedSearches}
              messagesCountDict={messagesCountDict}
            />
          )}
          {/* Trends for Attachment Types */}
          {messagesStats?.attachment_types && (
            <AttachmentTypesTrendList
              title="Attachment Types"
              items={messagesStats.attachment_types}
            />
          )}
          {messagesStatsToday?.attachment_types && (
            <AttachmentTypesTrendList
              title="Attachment Types (24h)"
              items={messagesStatsToday.attachment_types}
            />
          )}
          {/* Trends for Hashtags */}
          {messagesStats?.extracted_hashtags && (
            <SearchQueryTrendList
              title="Hashtags"
              items={messagesStats.extracted_hashtags}
            />
          )}
          {messagesStatsToday?.extracted_hashtags && (
            <SearchQueryTrendList
              title="Hashtags (24h)"
              items={messagesStatsToday.extracted_hashtags}
            />
          )}
          {/* Trends for Domains */}
          {messagesStats?.extracted_domains && (
            <SearchQueryTrendList
              title="Domains"
              items={messagesStats.extracted_domains}
            />
          )}
          {messagesStatsToday?.extracted_domains && (
            <SearchQueryTrendList
              title="Domains (24h)"
              items={messagesStatsToday.extracted_domains}
            />
          )}
          {/* Trends for Tags */}
          {messagesStats?.tags && (
            <TagsTrendList title="Tags" items={messagesStats.tags} />
          )}
          {/* Global Classifier Scores */}
          {classification_total?.score_pos_avg != null && (
            <Box
              startIcon={mdiAlarmLightOutline}
              title="Classification Rating"
              className="h-fit max-w-xs"
            >
              <RatingIndicator
                rating={classification_total.score_pos_avg}
                size="lg"
                description="The average score of all classified messages."
              />
            </Box>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
