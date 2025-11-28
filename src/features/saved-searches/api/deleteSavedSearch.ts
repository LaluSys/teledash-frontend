import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export async function deleteSavedSearch({ id }: { id: string }): Promise<void> {
  return axios.delete(`/saved-searches/${id}`);
}

type UseDeleteSavedSearchOptions = {
  mutationConfig?: MutationConfig<typeof deleteSavedSearch>;
};

export const useDeleteSavedSearch = ({
  mutationConfig,
}: UseDeleteSavedSearchOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["saved-searches"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteSavedSearch,
  });
};
