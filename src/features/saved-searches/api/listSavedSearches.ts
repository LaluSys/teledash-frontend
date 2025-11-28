import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";

import { SavedSearch } from "types";

export async function listSavedSearches(): Promise<SavedSearch[]> {
  return axios.get("/saved-searches");
}

export function useSavedSearchesList() {
  return useQuery({
    queryKey: ["saved-searches"],
    queryFn: listSavedSearches,
  });
}
