import { useMutation } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { MutationConfig } from "lib/react-query";

import { PostAddChatBody } from "types";

type AddChatOptions = {
  client_id: string;
  data: PostAddChatBody;
};

export const addChat = ({
  client_id,
  data,
}: AddChatOptions): Promise<{ status: string; message: string }> => {
  return axios.post(`/clients/${client_id}/add-chat`, data);
};

type UseAddChatOptions = {
  mutationConfig?: MutationConfig<typeof addChat>;
};

export const useAddChat = ({ mutationConfig }: UseAddChatOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig ?? {};

  return useMutation({
    onSuccess: (...args) => {
      // Chat will only be added to the client's chats list after init_scrapers is called,
      // so we don't need to refetch the clients or chats here.
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: addChat,
  });
};
