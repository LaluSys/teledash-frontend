import { useMutation } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export interface NgramGenerationRequest {
  chat_ids?: string[];
  date_from?: string;
  date_to?: string;
  n_values?: number[];
  min_frequency?: number;
  exclude_stopwords?: boolean;
  stopwords_language?: string;
}

export interface NgramGenerationResponse {
  task_id: string;
  status: string;
  message: string;
}

export async function triggerNgramGeneration(
  data: NgramGenerationRequest = {}
): Promise<NgramGenerationResponse> {
  return axios.post("/text-analysis/ngrams/generate", data);
}

type UseTriggerNgramGenerationOptions = {
  config?: MutationConfig<typeof triggerNgramGeneration>;
};

export const useTriggerNgramGeneration = ({
  config,
}: UseTriggerNgramGenerationOptions = {}) => {
  return useMutation({
    mutationFn: triggerNgramGeneration,
    ...config,
  });
};
