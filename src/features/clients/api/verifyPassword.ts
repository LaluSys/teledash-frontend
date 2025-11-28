import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";
import { PutVerifyPasswordResponse } from "types";

export const verifyPasswordInputSchema = z.object({
  password: z.string().min(1, "2FA/Cloud password is required"),
});

export type VerifyPasswordInput = z.infer<typeof verifyPasswordInputSchema>;

export const verifyPassword = ({
  id,
  data,
}: {
  id: string;
  data: VerifyPasswordInput;
}): Promise<PutVerifyPasswordResponse> => {
  return axios.put(`/clients/${id}/verify-password`, data);
};

type UseVerifyPasswordOptions = {
  mutationConfig?: MutationConfig<typeof verifyPassword>;
};

export const useVerifyPassword = ({
  mutationConfig,
}: UseVerifyPasswordOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["clients"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: verifyPassword,
  });
};
