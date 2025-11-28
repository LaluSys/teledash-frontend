import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { Chat } from "types";

export const updateChatInputSchema = z.object({
  language: z
    .string()
    .max(32) // TODO: Do we have a max length for language?
    .optional(),
  tags: z.array(z.string().max(32)).optional(), // TODO: Do we have/want a max length for tags?
});

export type UpdateChatInput = z.infer<typeof updateChatInputSchema>;

export async function updateChat({
  id,
  data,
}: {
  id: number;
  data: UpdateChatInput;
}): Promise<Chat> {
  return axios.put(`/chats/${id}`, data);
}

type UseUpdateChatOptions = {
  mutationConfig?: MutationConfig<typeof updateChat>;
};

export const useUpdateChat = ({
  mutationConfig,
}: UseUpdateChatOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["chat"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateChat,
  });
};
