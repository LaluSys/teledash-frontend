import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { Message } from "types";

export const updateMessageInputSchema = z.object({
  language: z
    .string()
    .max(32) // TODO: Do we have a max length for language?
    .optional(),
  tags: z.array(z.string().max(32)).optional(), // TODO: Do we have/want a max length for tags?
});

export type UpdateMessageInput = z.infer<typeof updateMessageInputSchema>;

export async function updateMessage({
  id,
  data,
}: {
  id: string;
  data: UpdateMessageInput;
}): Promise<Message> {
  return axios.put(`/messages/${id}`, data);
}

type UseUpdateMessageOptions = {
  mutationConfig?: MutationConfig<typeof updateMessage>;
};

export const useUpdateMessage = ({
  mutationConfig,
}: UseUpdateMessageOptions = {}) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      queryClient.refetchQueries({ queryKey: ["messages"] });
      queryClient.refetchQueries({ queryKey: ["tags"] });
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: updateMessage,
  });
};
