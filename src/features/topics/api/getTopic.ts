import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

import { Topic } from "./getTopics";

export async function getTopic(topicId: string): Promise<Topic> {
  return axios.get(`/topics/${topicId}`);
}

type UseTopicOptions = {
  topicId: string;
  config?: QueryConfig<typeof getTopic>;
};

export const useTopic = ({ topicId, config }: UseTopicOptions) => {
  return useQuery({
    queryKey: ["topics", topicId],
    queryFn: () => getTopic(topicId),
    enabled: !!topicId,
    ...config,
  });
};
