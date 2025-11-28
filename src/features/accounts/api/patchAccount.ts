import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { Account } from "types";

export const patchAccountInputSchema = z
  .object({
    first_name: z
      .string()
      .max(32)
      // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    last_name: z
      .string()
      .max(32)
      // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    email: z
      .union([z.string().email(), z.string().length(0)])
      // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    password: z
      .union([
        z.string().min(8, "Enter a password of at least 8 characters."),
        z.string().length(0),
      ])
      // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    confirm_password: z
      .union([z.string().min(8, "Confirm password."), z.string().length(0)])
      // Replacing empty strings with undefined allows the field to stay unmodified when it is left empty.
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
    is_active: z.boolean().optional(),
    is_verified: z.boolean().optional(),
    is_superuser: z.boolean().optional(),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if ((password || confirm_password) && password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirm_password"],
      });
    }
  });

export type PatchAccountInput = z.infer<typeof patchAccountInputSchema>;

export function patchAccount({
  id,
  data,
}: {
  id: string;
  data: PatchAccountInput;
}): Promise<Account> {
  return axios.patch(`/accounts/${id}`, data);
}

export const patchCurrentAccount = ({
  data,
}: {
  data: PatchAccountInput;
}): Promise<Account> => {
  return axios.patch(`/accounts/me`, data);
};

type UsePatchAccountOptions = {
  mutationConfig?: MutationConfig<typeof patchAccount>;
};

export const usePatchAccount = ({
  mutationConfig,
}: UsePatchAccountOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["accounts"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: patchAccount,
  });
};

type UsePatchCurrentAccountOptions = {
  mutationConfig?: MutationConfig<typeof patchCurrentAccount>;
};

export const usePatchCurrentAccount = ({
  mutationConfig,
}: UsePatchCurrentAccountOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["authenticated-user"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: patchCurrentAccount,
  });
};
