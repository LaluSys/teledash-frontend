import { useMutation, useQueryClient } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

export const deleteClient = ({ id }: { id: string }): Promise<void> => {
  return axios.delete(`/clients/${id}`);
};

type UseDeleteClientOptions = {
  mutationConfig?: MutationConfig<typeof deleteClient>;
};

export const useDeleteClient = ({
  mutationConfig,
}: UseDeleteClientOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["clients"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: deleteClient,
  });
};
