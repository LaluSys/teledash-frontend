import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export interface EntityMessage {
  id: string;
  text: string;
  date: string;
  chat_id: string;
  chat_title?: string;
  sender_id?: string;
  entities?: Array<{
    entity_id: string;
    text: string;
    entity_type: string;
    start_offset: number;
    end_offset: number;
  }>;
}

export interface GetEntityMessagesParams {
  limit?: number;
  offset?: number;
}

export async function getEntityMessages(
  entityId: string,
  params: GetEntityMessagesParams = {}
): Promise<EntityMessage[]> {
  return axios.get(`/text-analysis/entities/${entityId}/messages`, { params });
}

type UseEntityMessagesOptions = {
  entityId: string;
  params?: GetEntityMessagesParams;
  config?: QueryConfig<typeof getEntityMessages>;
};

export const useEntityMessages = ({
  entityId,
  params,
  config,
}: UseEntityMessagesOptions) => {
  return useQuery({
    queryKey: ["entities", entityId, "messages", params],
    queryFn: () => getEntityMessages(entityId, params),
    enabled: !!entityId,
    ...config,
  });
};
