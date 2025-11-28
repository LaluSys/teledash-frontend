import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { GetMessagesParams, SavedSearch } from "types";

export const saveSearchInputSchema = z.object({
  name: z.string().trim().min(2).max(255),
});

export type SaveSearchInput = z.infer<typeof saveSearchInputSchema> & {
  params: GetMessagesParams;
};

export async function saveSearch({
  data,
}: {
  data: SaveSearchInput;
}): Promise<SavedSearch> {
  return axios.post(`/saved-searches`, data);
}

type UseSaveSearchOptions = {
  mutationConfig?: MutationConfig<typeof saveSearch>;
};

export const useSaveSearch = ({
  mutationConfig,
}: UseSaveSearchOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({
        queryKey: ["saved-searches"],
      });
      queryClient.refetchQueries({
        queryKey: ["saved-searches-count"],
      });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: saveSearch,
  });
};
