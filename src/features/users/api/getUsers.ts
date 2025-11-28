import { useInfiniteQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { InfiniteQueryConfig } from "lib/react-query";

import { GetUsersParams, GetUsersResponse, User } from "types";

export async function getUsers(
  params: GetUsersParams = {},
): Promise<GetUsersResponse> {
  return axios.get("/users", { params });
}

type UseUsersOptions = {
  params?: GetUsersParams;
  config?: InfiniteQueryConfig<typeof getUsers>;
};

export const useUsers = ({ params, config }: UseUsersOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ["users", params],
    // We use an object with `skip` and `limit` properties as the `initialPageParam` as they are used by pymongo's `find()` method backend-side.
    initialPageParam: { skip: 0, limit: params?.limit },
    queryFn: ({ pageParam }) => getUsers({ ...params, ...pageParam }),
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

export const useUserNames = (): Pick<
  User,
  "id" | "username" | "first_name" | "last_name"
>[] => {
  // TODO: If "include" works again, use that instead.
  const { data: users } = useUsers({
    params: {
      limit: 10000,
      exclude: [
        "is_self",
        "is_contact",
        "is_mutual_contact",
        "is_deleted",
        "is_bot",
        "is_verified",
        "is_restricted",
        "is_scam",
        "is_fake",
        "is_support",
        "metrics", // TODO: Not stored in elastic so this has no effect (yet).
        "status",
        "last_online_date",
        "next_offline_date",
        "language_code",
        "dc_id",
        "phone_number",
        "photo",
        "restrictions",
        "updated_at",
        "scraped_by",
        "in_chats",
        "highlight", // TODO: Not stored in elastic so this has no effect (yet).
        "score", // TODO: Not stored in elastic so this has no effect (yet).
      ],
    },
  });

  return users?.pages[0].data ?? [];
};
