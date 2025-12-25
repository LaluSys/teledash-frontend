import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface TopicModelingStatus {
  status: "idle" | "running" | "error";
  task_id?: string;
  started_at?: string;
  message?: string;
}

export async function getTopicStatus(): Promise<TopicModelingStatus> {
  return axios.get("/topics/status");
}

type UseTopicStatusOptions = {
  config?: QueryConfig<typeof getTopicStatus>;
  refetchInterval?: number | false;
};

export const useTopicStatus = ({ 
  config, 
  refetchInterval = 10000 
}: UseTopicStatusOptions = {}) => {
  return useQuery({
    queryKey: ["topic-status"],
    queryFn: () => getTopicStatus(),
    refetchInterval,
    ...config,
  });
};
