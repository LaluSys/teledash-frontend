import { Fragment } from "react";

import { Button, LoadingState, LoadMoreButton } from "components/Elements";
import { ClientListItem, useListClients } from "features/clients";

import { ListClientsParams } from "types";

const defaultQueryParams: ListClientsParams = {
  limit: 50,
};

interface ClientListProps {
  queryParams?: ListClientsParams;
}

export function ClientList({ queryParams }: ClientListProps) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useListClients({
    params: { ...defaultQueryParams, ...queryParams },
  });

  const hasResults = data && data.pages[0].data.length > 0;

  return (
    <>
      {status === "pending" ? (
        <LoadingState size="sm" message="Loading accounts…" />
      ) : status === "error" ? (
        <div className="text-red-500">Error: {error?.message}</div>
      ) : hasResults ? (
        <div className="-mx-4 bg-white shadow sm:mx-0 sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {data?.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((client) => (
                  <ClientListItem key={client.id} {...client} />
                ))}
              </Fragment>
            ))}
          </ul>

          <LoadMoreButton
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </div>
      ) : (
        <div>No accounts found.</div>
      )}
    </>
  );
}
