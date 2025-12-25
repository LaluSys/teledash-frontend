import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface SentimentBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface SentimentByChatItem {
  chat_id: string;
  chat_name: string | null;
  sentiment_breakdown: SentimentBreakdown;
  total_messages: number;
  average_confidence: number;
}

export interface SentimentStats {
  total_messages: number;
  sentiment_breakdown: SentimentBreakdown;
  average_score: number;
  average_confidence: number;
  by_chat: SentimentByChatItem[];
  date_range: {
    from: string;
    to: string;
  };
}

export interface GetSentimentStatsParams {
  chat_ids?: string[];
  date_from?: string;
  date_to?: string;
  min_confidence?: number;
}

export async function getSentimentStats(
  params: GetSentimentStatsParams = {}
): Promise<SentimentStats> {
  return axios.get("/text-analysis/sentiment/stats", { params });
}

type UseSentimentStatsOptions = {
  params?: GetSentimentStatsParams;
  config?: QueryConfig<typeof getSentimentStats>;
};

export const useSentimentStats = ({
  params,
  config,
}: UseSentimentStatsOptions = {}) => {
  return useQuery({
    queryKey: ["sentiment", "stats", params],
    queryFn: () => getSentimentStats(params),
    ...config,
  });
};
