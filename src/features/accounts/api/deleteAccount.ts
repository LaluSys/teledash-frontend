import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export async function deleteAccount({ id }: { id: string }): Promise<void> {
  return axios.delete(`/accounts/${id}`);
}

type UseDeleteAccountOptions = {
  mutationConfig?: MutationConfig<typeof deleteAccount>;
};

export const useDeleteAccount = ({
  mutationConfig,
}: UseDeleteAccountOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["accounts"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteAccount,
  });
};
