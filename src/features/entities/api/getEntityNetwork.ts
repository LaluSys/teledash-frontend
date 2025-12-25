import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";
import { EntityType } from "./getEntities";

export interface EntityNode {
  id: string;
  name: string;
  entity_type: EntityType;
  frequency: number;
}

export interface EntityEdge {
  source: string;
  target: string;
  weight: number;
  cooccurrence_count: number;
}

export interface EntityNetwork {
  nodes: EntityNode[];
  edges: EntityEdge[];
}

export interface GetEntityNetworkParams {
  chat_ids?: string[];
  entity_types?: EntityType[];
  min_cooccurrence?: number;
  max_nodes?: number;
}

export async function getEntityNetwork(
  params: GetEntityNetworkParams = {}
): Promise<EntityNetwork> {
  return axios.get("/text-analysis/entities/network", { params });
}

type UseEntityNetworkOptions = {
  params?: GetEntityNetworkParams;
  config?: QueryConfig<typeof getEntityNetwork>;
};

export const useEntityNetwork = ({
  params,
  config,
}: UseEntityNetworkOptions = {}) => {
  return useQuery({
    queryKey: ["entities", "network", params],
    queryFn: () => getEntityNetwork(params),
    ...config,
  });
};
