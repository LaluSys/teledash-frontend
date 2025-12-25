import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface Topic {
  topic_id: string;
  topic_number: number;
  top_words: string[];
  top_words_scores: number[];
  representative_docs: string[];
  size: number;
  coherence_score?: number;
  first_seen?: string;
  last_seen?: string;
  metadata: {
    primary_channels: string[];
    extremism_category?: string;
    language: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface GetTopicsParams {
  limit?: number;
  sort_by?: "size" | "created_at" | "updated_at";
  order?: "asc" | "desc";
  extremism_category?: string;
  min_size?: number;
}

export async function getTopics(
  params: GetTopicsParams = {}
): Promise<Topic[]> {
  return axios.get("/topics", { params });
}

type UseTopicsOptions = {
  params?: GetTopicsParams;
  config?: QueryConfig<typeof getTopics>;
};

export const useTopics = ({ params, config }: UseTopicsOptions = {}) => {
  return useQuery({
    queryKey: ["topics", params],
    queryFn: () => getTopics(params),
    ...config,
  });
};
