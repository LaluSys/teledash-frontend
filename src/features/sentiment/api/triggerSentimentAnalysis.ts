import { useMutation } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig, queryClient } from "lib/react-query";

export interface TriggerSentimentAnalysisRequest {
  chat_ids?: string[];
  date_from?: string;
  date_to?: string;
  reanalyze?: boolean;
  method?: "vader" | "textblob";
}

export interface TriggerSentimentAnalysisResponse {
  task_id: string;
  status: string;
  message: string;
}

export async function triggerSentimentAnalysis(
  data: TriggerSentimentAnalysisRequest
): Promise<TriggerSentimentAnalysisResponse> {
  return axios.post("/text-analysis/sentiment/trigger", data);
}

type UseTriggerSentimentAnalysisOptions = {
  config?: MutationConfig<typeof triggerSentimentAnalysis>;
};

export const useTriggerSentimentAnalysis = ({
  config,
}: UseTriggerSentimentAnalysisOptions = {}) => {
  return useMutation({
    ...config,
    mutationFn: triggerSentimentAnalysis,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ["sentiment"] });
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
};
