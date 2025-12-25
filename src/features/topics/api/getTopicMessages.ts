import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface TopicMessage {
  id: string;
  text: string;
  date: string;
  chat_id: string;
  topic_probability?: number;
  topics?: Array<{
    topic_id: string;
    probability: number;
  }>;
}

export interface GetTopicMessagesParams {
  limit?: number;
}

export async function getTopicMessages(
  topicId: string,
  params: GetTopicMessagesParams = {}
): Promise<TopicMessage[]> {
  return axios.get(`/topics/${topicId}/messages`, { params });
}

type UseTopicMessagesOptions = {
  topicId: string;
  params?: GetTopicMessagesParams;
  config?: QueryConfig<typeof getTopicMessages>;
};

export const useTopicMessages = ({
  topicId,
  params,
  config,
}: UseTopicMessagesOptions) => {
  return useQuery({
    queryKey: ["topics", topicId, "messages", params],
    queryFn: () => getTopicMessages(topicId, params),
    enabled: !!topicId,
    ...config,
  });
};
