import { useInfiniteQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";

import { GetMessagesParams, GetMessagesResponse } from "types";

export async function getMessages(
  params: GetMessagesParams = {},
): Promise<GetMessagesResponse> {
  return axios.get("/messages", { params });
}

type UseMessagesOptions = {
  params?: GetMessagesParams;
  config?: InfiniteQueryConfig<typeof getMessages>;
};

export const useMessages = ({ params, config }: UseMessagesOptions) => {
  return useInfiniteQuery({
    queryKey: ["messages", params],
    // We use an object with `skip` and `limit` properties as the `initialPageParam` as they are used by pymongo's `find()` method backend-side.
    initialPageParam: { skip: 0, limit: params?.limit },
    queryFn: ({ pageParam }) => getMessages({ ...params, ...pageParam }),
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
