import { useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect } from "react";

import {
  LoadingState,
  LoadMoreButton,
  ResultsCount,
} from "components/Elements";
import { Message, MessageSortSelector, useMessages } from "features/messages";

import { DateSeparator } from "features/messages";
import { GetMessagesParams, MessageSortBy, OrderEnum } from "types";

export const defaultQueryParams: GetMessagesParams = {
  search_type: "flexible",
  limit: 50,
  exclude: [
    "is_outgoing",
    "scraped_by",
    "mentioned",
    "author_signature",
    "message_id",
    "updated_at",
    "language",
  ],
};

type MessageListProps = {
  queryParams?: GetMessagesParams;
  onUpdateSort: (sortBy: MessageSortBy, order: OrderEnum) => void;
};

export const MessageList = ({
  queryParams,
  onUpdateSort,
}: MessageListProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isSuccess,
  } = useMessages({
    params: { ...defaultQueryParams, ...queryParams },
  });

  const hasResults = data && data.pages[0].data.length > 0;

  const queryClient = useQueryClient();

  // If the query contains a saved search ID, the saved search's last_visited
  // timestamp will be updated and hence we need to refetch the saved searches
  // count.
  useEffect(() => {
    if (queryParams?.saved_search_id && isSuccess) {
      queryClient.refetchQueries({
        queryKey: ["saved-searches-count"],
      });
    }
  }, [isSuccess, queryParams?.saved_search_id, queryClient]);

  return (
    <>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading messages…" />
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="space-y-2 bg-gray-100">
          <div className="flex w-full items-center justify-end space-x-4">
            {data.pages[0].count_total != null && (
              <ResultsCount count={data.pages[0].count_total} />
            )}
            <MessageSortSelector
              currentSort={{
                ...data.pages[0].sort,
                sortBy: data.pages[0].sort.sort_by,
              }}
              onUpdateSort={onUpdateSort}
              ignoreSortByOptions={
                queryParams?.search_query ? undefined : ["score"]
              }
            />
          </div>
          <div className="-mx-4 bg-white sm:mx-0 sm:rounded-lg">
            <ul className="flex flex-col gap-4 bg-gray-100">
              {data.pages.map((page, pageIndex) => {
                // Get the last message from the previous page for date comparison
                const previousPage =
                  pageIndex > 0 ? data.pages[pageIndex - 1] : null;
                const lastMessageFromPrevPage =
                  previousPage?.data[previousPage.data.length - 1];

                return (
                  <Fragment key={pageIndex}>
                    {page.data.map((message, messageIndex) => {
                      // Determine the previous message for date comparison
                      const previousMessage =
                        messageIndex > 0
                          ? page.data[messageIndex - 1]
                          : lastMessageFromPrevPage;

                      const needsDateSeparator =
                        !!message.date &&
                        !!previousMessage?.date &&
                        message.date.slice(0, 10) !==
                          previousMessage?.date?.slice(0, 10);

                      return (
                        <Fragment key={message.id}>
                          {data.pages[0].sort.sort_by === "date" &&
                            needsDateSeparator && (
                              <DateSeparator date={message.date} />
                            )}
                          <li className="border bg-white shadow sm:rounded-xl sm:rounded-tl">
                            <Message {...message} />
                          </li>
                        </Fragment>
                      );
                    })}
                  </Fragment>
                );
              })}
            </ul>
            <LoadMoreButton
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={fetchNextPage}
            />
          </div>
        </div>
      ) : (
        <div>No messages found.</div>
      )}
    </>
  );
};
