import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { GetMessagesStatsParams, GetMessagesStatsResponse } from "types";

export async function getMessagesStats(
  params: GetMessagesStatsParams = {},
): Promise<GetMessagesStatsResponse> {
  return axios.get("/messages/stats", { params });
}

type UseMessagesStatsOptions = {
  params?: GetMessagesStatsParams;
};

export function useMessagesStats({ params }: UseMessagesStatsOptions = {}) {
  return useQuery({
    queryKey: ["messages-stats", params],
    queryFn: () => getMessagesStats(params),
  });
}
