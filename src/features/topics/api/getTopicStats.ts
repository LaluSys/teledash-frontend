import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

import { Topic } from "./getTopics";

export interface TopicStats {
  total_topics: number;
  total_messages_assigned: number;
  extremism_breakdown: Record<string, number>;
  top_topics: Topic[];
}

export async function getTopicStats(): Promise<TopicStats> {
  return axios.get("/topics/stats");
}

type UseTopicStatsOptions = {
  config?: QueryConfig<typeof getTopicStats>;
};

export const useTopicStats = ({ config }: UseTopicStatsOptions = {}) => {
  return useQuery({
    queryKey: ["topics", "stats"],
    queryFn: () => getTopicStats(),
    ...config,
  });
};
