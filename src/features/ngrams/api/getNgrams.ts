import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface Ngram {
  ngram: string;
  frequency: number;
  tf_idf_score: number;
  n_value: number;
}

export interface NgramResponse {
  ngrams: Ngram[];
  total_documents: number;
  date_range: {
    from: string;
    to: string;
  };
  parameters: {
    n_values: number[];
    min_frequency: number;
    chat_ids?: string[];
  };
}

export interface GetNgramsParams {
  chat_ids?: string[];
  date_from?: string;
  date_to?: string;
  n_values?: number[];
  min_frequency?: number;
}

export async function getNgrams(
  params: GetNgramsParams = {}
): Promise<NgramResponse> {
  return axios.get("/text-analysis/ngrams", { params });
}

type UseNgramsOptions = {
  params?: GetNgramsParams;
  config?: QueryConfig<typeof getNgrams>;
};

export const useNgrams = ({ params, config }: UseNgramsOptions = {}) => {
  return useQuery({
    queryKey: ["ngrams", params],
    queryFn: () => getNgrams(params),
    ...config,
  });
};
