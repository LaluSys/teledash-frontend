import { useQuery } from "@tanstack/react-query";

import { axios } from "lib/axios";
import { QueryConfig } from "lib/react-query";

import { Entity } from "./getEntities";

export async function getEntity(entityId: string): Promise<Entity> {
  return axios.get(`/text-analysis/entities/${entityId}`);
}

type UseEntityOptions = {
  entityId: string;
  config?: QueryConfig<typeof getEntity>;
};

export const useEntity = ({ entityId, config }: UseEntityOptions) => {
  return useQuery({
    queryKey: ["entities", entityId],
    queryFn: () => getEntity(entityId),
    enabled: !!entityId,
    ...config,
  });
};
