import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { GlobalMetricsResponse } from "types";

export const listMetrics = (): Promise<GlobalMetricsResponse> => {
  return axios.get("/metrics");
};

export function useListMetrics() {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: listMetrics,
  });
}
