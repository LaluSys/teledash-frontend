import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

export function getTags(): Promise<string[]> {
  return axios.get("/tags");
}

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });
}
