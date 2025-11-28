import { mdiOpenInNew } from "@mdi/js";
import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { createDisplayNameFromUser, createUserBadgesArray, useUser } from "..";

import {
  Badge,
  Box,
  Button,
  FormattedMetricNumber,
  LoadingState,
  ReactECharts,
  ReactEChartsProps,
} from "components/Elements";
import { ContentLayout } from "components/Layout";
import { MessageList } from "features/messages";
import {
  FilterContext,
  SearchForm,
  UpdateFiltersOptions,
  useFilterStore,
} from "features/search";
import { formatNumber } from "utils/formatNumber";

import { UserMetrics } from "types";

// TODO: Merge with ActivityChart in ECharts.tsx
// Only difference is time_delta, which is oneHour here.
const ActivityChart = ({
  metric,
}: {
  metric: UserMetrics["activity_total"];
}) => {
  if (!metric?.start_date || !metric.data) return null;

  let base = +new Date(metric.start_date);
  const oneHour = 3600 * 1000;
  const date = [];

  for (let i = 0; i < metric.data.length; i++) {
    const now = new Date((base += oneHour));
    const time = now.getHours().toString().padStart(2, "0") + ":00";
    date.push(
      [now.getDate(), now.getMonth(), now.getFullYear() + 1].join(".") +
        " " +
        time,
    );
  }

  const option: ReactEChartsProps["option"] | undefined = {
    tooltip: {
      trigger: "axis",
      formatter: "{c} messages on {b}",
      position: function (pt) {
        return [pt[0], "10%"];
      },
    },
    grid: {
      left: 30,
      top: 30,
      right: 10,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: "none",
        },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "inside",
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 100,
      },
    ],
    xAxis: {
      type: "category",
      data: date,
    },
    yAxis: {
      type: "value",
      minInterval: 1,
    },
    series: [
      {
        name: "Activity",
        type: "line",
        data: metric.data,
        smooth: true,
        connectNulls: true,
        zlevel: 1,
      },
    ],
  };

  return <ReactECharts option={option} />;
};

const UserMessages = ({ userId }: { userId: number }) => {
  const filterId = `user-filter-${userId}`;
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
          from_user_ids: [userId],
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
    () => ({ messages: { from_user_ids: [userId] } }),
    [userId],
  );

  if (!filterOptions) return null;

  return (
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
  );
};

export const User = () => {
  const { userId } = useParams() as { userId: string };
  const userQuery = useUser({ userId });

  if (userQuery.isLoading) {
    return (
      <ContentLayout>
        <LoadingState size="sm" message="Loading user…" />
      </ContentLayout>
    );
  }

  if (userQuery.isError) {
    return (
      <ContentLayout title="User not found">
        No data has been collected for the user with ID{" "}
        <strong>{userId}</strong> yet.
      </ContentLayout>
    );
  }

  if (!userQuery.data) return null;

  const user = userQuery.data;
  const badgesArray = createUserBadgesArray(user);
  const messageCountLastDay = user.metrics?.activity_last_day?.sum ?? 0;
  const messageCountTotal = user.metrics?.activity_total?.sum ?? 0;

  return (
    <ContentLayout
      title={createDisplayNameFromUser(user)}
      titleExtra={
        badgesArray.length > 0 && (
          <div className="flex flex-nowrap items-center space-x-2">
            {badgesArray.map(({ label, variant }) => (
              <Badge
                key={label}
                label={label}
                size="md"
                variant={variant}
                className="sm:text-md px-2 py-0.5 text-sm sm:px-3 sm:py-1"
              />
            ))}
          </div>
        )
      }
    >
      {user.username && (
        <div className="mt-1.5 flex items-center space-x-2 whitespace-nowrap lg:mt-0">
          <Button
            as="externalLink"
            variant="secondary"
            size="xs"
            startIcon={mdiOpenInNew}
            href={"https://t.me/" + user.username}
          >
            @{user.username}
          </Button>
        </div>
      )}
      <div className="mt-4 space-y-4 xl:grid xl:grid-cols-2 xl:gap-4 xl:space-y-0">
        <Box title="Activity">
          <div className="h-80">
            <ActivityChart metric={user.metrics?.activity_total} />
          </div>
        </Box>

        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 xl:flex xl:items-start">
          {/* message count */}
          <Box title="Activity last 24h">
            <div className="text-3xl">
              <FormattedMetricNumber value={messageCountLastDay} />
            </div>
            <div className="text-sm text-gray-500">
              {formatNumber(messageCountTotal)} saved
            </div>
          </Box>
        </div>
      </div>

      {/* Messages */}
      <div className="mt-8">
        <h2 className="mb-6 text-xl font-bold leading-7 sm:text-2xl">
          Messages
        </h2>
        <UserMessages userId={Number(userId)} />
      </div>
    </ContentLayout>
  );
};
