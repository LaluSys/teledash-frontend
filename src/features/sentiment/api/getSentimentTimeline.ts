import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface SentimentTimelinePoint {
  timestamp: string;
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

export interface SentimentTimeline {
  data: SentimentTimelinePoint[];
  granularity: string;
}

export interface GetSentimentTimelineParams {
  chat_ids?: string[];
  date_from?: string;
  date_to?: string;
  granularity?: "hour" | "day" | "week" | "month";
}

export async function getSentimentTimeline(
  params: GetSentimentTimelineParams = {}
): Promise<SentimentTimeline> {
  return axios.get("/text-analysis/sentiment/timeline", { params });
}

type UseSentimentTimelineOptions = {
  params?: GetSentimentTimelineParams;
  config?: QueryConfig<typeof getSentimentTimeline>;
};

export const useSentimentTimeline = ({
  params,
  config,
}: UseSentimentTimelineOptions = {}) => {
  return useQuery({
    queryKey: ["sentiment", "timeline", params],
    queryFn: () => getSentimentTimeline(params),
    ...config,
  });
};
