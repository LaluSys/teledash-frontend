import { useMutation } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export interface TriggerTopicModelingRequest {
  chat_ids?: string[];
  min_messages?: number;
  update_existing?: boolean;
  min_topic_size?: number;
  max_topics?: number;
  min_message_length?: number;
  message_limit?: number;
  method?: "nmf" | "lda";
}

export interface TriggerTopicModelingResponse {
  task_id: string;
  status: string;
  message: string;
}

export async function triggerTopicModeling(
  data: TriggerTopicModelingRequest = {}
): Promise<TriggerTopicModelingResponse> {
  return axios.post("/topics/trigger", data);
}

type UseTriggerTopicModelingOptions = {
  config?: MutationConfig<typeof triggerTopicModeling>;
};

export const useTriggerTopicModeling = ({
  config,
}: UseTriggerTopicModelingOptions = {}) => {
  return useMutation({
    mutationFn: triggerTopicModeling,
    ...config,
  });
};
