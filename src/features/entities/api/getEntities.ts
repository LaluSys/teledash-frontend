import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

export type EntityType = "PERSON" | "ORG" | "LOC" | "EVENT" | "MISC";

export interface Entity {
  entity_id: string;
  text: string;
  entity_type: EntityType;
  frequency: number;
  first_seen?: string;
  last_seen?: string;
  message_ids?: string[];
  metadata?: {
    primary_chats?: string[];
    related_topics?: string[];
  };
}

export interface GetEntitiesParams {
  type?: EntityType;
  min_frequency?: number;
  limit?: number;
  offset?: number;
  chat_ids?: string[];
}

export interface PaginatedEntities {
  entities: Entity[];
  total: number;
  offset: number;
  limit: number;
}

export async function getEntities(
  params: GetEntitiesParams = {}
): Promise<Entity[]> {
  const response: PaginatedEntities = await axios.get("/text-analysis/entities", { params });
  return response.entities;
}

type UseEntitiesOptions = {
  params?: GetEntitiesParams;
  config?: QueryConfig<typeof getEntities>;
};

export const useEntities = ({ params, config }: UseEntitiesOptions = {}) => {
  return useQuery({
    queryKey: ["entities", params],
    queryFn: () => getEntities(params),
    ...config,
  });
};
