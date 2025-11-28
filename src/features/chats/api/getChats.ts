import { useInfiniteQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";

import { Chat, GetChatsParams, GetChatsResponse } from "types";

export async function getChats(
  params: GetChatsParams = {},
): Promise<GetChatsResponse> {
  return axios.get("/chats", { params });
}

type UseChatsOptions = {
  params?: GetChatsParams;
  config?: InfiniteQueryConfig<typeof getChats>;
};

export const useChats = ({ params, config }: UseChatsOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["chats", params],
    // We use an object with `skip` and `limit` properties as the `initialPageParam` as they are used by pymongo's `find()` method backend-side.
    initialPageParam: { skip: 0, limit: params?.limit },
    queryFn: ({ pageParam }) => getChats({ ...params, ...pageParam }),
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

export const useChatNames = (): Pick<Chat, "id" | "title">[] => {
  // TODO: If "include" works again, use that instead.
  const { data: chats } = useChats({
    params: {
      limit: 10000,
      exclude: [
        "language",
        "language_other",
        "type",
        "username",
        "is_verified",
        "is_restricted",
        "is_scam",
        "is_fake",
        "photo",
        "description",
        "invite_link",
        "pinned_message",
        "members",
        "members_count",
        "metrics", // TODO: Not stored in elastic so this has no effect (yet).
        "linked_chat",
        "restrictions",
        "permissions",
        "updated_at",
        "history_updated_at",
        "scraped_by",
        "similar_channels",
        "classification_aggregated", // TODO: Not stored in elastic so this has no effect (yet).
        "highlight", // TODO: Not stored in elastic so this has no effect (yet).
        "score", // TODO: Not stored in elastic so this has no effect (yet).
      ],
      aggregations: false,
    },
  });

  return chats?.pages[0].data ?? [];
};
