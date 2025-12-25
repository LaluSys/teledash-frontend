import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const MONITORING_API_URL = "http://localhost:8003";

export type QueueStatus = {
  queue_name: string;
  active_tasks: number;
  queued_tasks: number;
  worker_online: boolean;
  current_tasks: Array<{
    task_id: string;
    task_name: string;
    worker: string;
    started_at?: number;
  }>;
};

export type ProcessingStatus = {
  timestamp: string;
  queues: Record<string, QueueStatus>;
  total_active: number;
  total_queued: number;
};

export const useMLProcessingStatus = () => {
  return useQuery({
    queryKey: ["ml-processing-status"],
    queryFn: async (): Promise<ProcessingStatus> => {
      const { data } = await axios.get(`${MONITORING_API_URL}/status`);
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
    retry: 1,
    staleTime: 0,
  });
};
