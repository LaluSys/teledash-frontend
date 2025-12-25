import { useMutation } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export interface TriggerNERRequest {
  chat_ids?: string[];
  min_messages?: number;
  update_existing?: boolean;
  entity_types?: string[];
}

export interface TriggerNERResponse {
  task_id: string;
  status: string;
  message: string;
}

export async function triggerNER(
  data: TriggerNERRequest = {}
): Promise<TriggerNERResponse> {
  return axios.post("/text-analysis/entities/trigger", data);
}

type UseTriggerNEROptions = {
  config?: MutationConfig<typeof triggerNER>;
};

export const useTriggerNER = ({ config }: UseTriggerNEROptions = {}) => {
  return useMutation({
    mutationFn: triggerNER,
    ...config,
  });
};
