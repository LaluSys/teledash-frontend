import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { PostCreateClientResponse } from "types";

export const createClientInputSchema = z.object({
  title: z.string().max(32).min(1),
  phone_number: z.string().regex(/^\d+$/).min(5).max(15),
  api_id: z.string().length(8),
  api_hash: z.string().length(32),
});

export type CreateClientInput = z.infer<typeof createClientInputSchema>;

export const createClient = ({
  data,
}: {
  data: CreateClientInput;
}): Promise<PostCreateClientResponse> => {
  return axios.post("/clients", data);
};

type UseCreateClientOptions = {
  mutationConfig?: MutationConfig<typeof createClient>;
};

export const useCreateClient = ({
  mutationConfig,
}: UseCreateClientOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["clients"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createClient,
  });
};
