import { useInfiniteQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";

import { ListClientsParams, ListClientsResponse } from "types";

export async function listClients(
  params: ListClientsParams = {},
): Promise<ListClientsResponse> {
  return axios.get("/clients", { params });
}

type UseListClientsOptions = {
  params?: ListClientsParams;
  config?: InfiniteQueryConfig<typeof listClients>;
};

export const useListClients = ({
  params,
  config,
}: UseListClientsOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["clients", params],
    // We use an object with `skip` and `limit` properties as the `initialPageParam` as they are used by pymongo's `find()` method backend-side.
    initialPageParam: { skip: 0, limit: params?.limit },
    queryFn: ({ pageParam }) => listClients({ ...params, ...pageParam }),
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
};
