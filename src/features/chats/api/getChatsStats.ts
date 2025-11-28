import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { GetChatsStatsParams, GetChatsStatsResponse } from "types";

export async function getChatsStats(
  params: GetChatsStatsParams = {},
): Promise<GetChatsStatsResponse> {
  return axios.get("/chats/stats", { params });
}

type UseChatsStatsOptions = {
  params?: GetChatsStatsParams;
};

export function useChatsStats({ params }: UseChatsStatsOptions = {}) {
  return useQuery({
    queryKey: ["chats-stats", params],
    queryFn: () => getChatsStats(params),
  });
}
