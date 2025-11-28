import { useInfiniteQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";

import { ListAccountsParams, PaginatedAccounts } from "types";

export async function listAccounts(
  params: ListAccountsParams = {},
): Promise<PaginatedAccounts> {
  return axios.get("/accounts", { params });
}

type UseAccountsOptions = {
  params?: ListAccountsParams;
  config?: InfiniteQueryConfig<typeof listAccounts>;
};

export function useListAccounts({ params, config }: UseAccountsOptions = {}) {
  return useInfiniteQuery({
    queryKey: ["accounts", params],
    // We use an object with `skip` and `limit` properties as the `initialPageParam` as they are used by pymongo's `find()` method backend-side.
    initialPageParam: { skip: 0, limit: params?.limit },
    queryFn: ({ pageParam }) => listAccounts({ ...params, ...pageParam }),
    getNextPageParam: (lastPage, _pages) => {
      if (
        !lastPage.data.length ||
        lastPage.data.length < lastPage.pagination.limit
      ) {
        return undefined;
      }

      const { offset, limit } = lastPage.pagination;
      return { skip: offset + limit, limit };
    },
    ...config, // needs to be last to override the default options
  });
}
