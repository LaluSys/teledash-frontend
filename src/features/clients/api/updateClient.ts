import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { PostCreateClientResponse } from "types";

export const updateClientInputSchema = z.object({
  title: z
    .string()
    .max(32)
    // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  is_active: z.boolean().optional(),
});

export type UpdateClientInput = z.infer<typeof updateClientInputSchema>;

export const updateClient = ({
  id,
  data,
}: {
  id: string;
  data: UpdateClientInput;
}): Promise<PostCreateClientResponse> => {
  return axios.put(`/clients/${id}`, data);
};

type UseUpdateClientOptions = {
  mutationConfig?: MutationConfig<typeof updateClient>;
};

export const useUpdateClient = ({
  mutationConfig,
}: UseUpdateClientOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["clients"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateClient,
  });
};
