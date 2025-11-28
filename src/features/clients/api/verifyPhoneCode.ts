import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";
import { PutVerifyPhoneCodeResponse } from "types";

export const verifyPhoneCodeInputSchema = z.object({
  phone_code_hash: z.string().length(18),
  phone_code: z.string().length(5),
});

export type VerifyPhoneCodeInput = z.infer<typeof verifyPhoneCodeInputSchema>;

export const verifyPhoneCode = ({
  id,
  data,
}: {
  id: string;
  data: VerifyPhoneCodeInput;
}): Promise<PutVerifyPhoneCodeResponse> => {
  return axios.put(`/clients/${id}/verify-phone-code`, data);
};

type UseVerifyPhoneCodeOptions = {
  mutationConfig?: MutationConfig<typeof verifyPhoneCode>;
};

export const useVerifyPhoneCode = ({
  mutationConfig,
}: UseVerifyPhoneCodeOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["clients"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: verifyPhoneCode,
  });
};
