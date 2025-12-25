import { mdiLoading, mdiCheckCircle, mdiCloseCircle, mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Tippy from "@tippyjs/react";
import clsx from "clsx";

import { useMLProcessingStatus } from "hooks/useMLProcessingStatus";

const ML_SERVICE_LABELS: Record<string, string> = {
  classification: "Classification",
  sentiment: "Sentiment",
  ner: "Entities",
  topic_modeling: "Topics",
  asr: "Speech-to-Text",
  "text-embeddings": "Text Search",
  "image-embeddings": "Image Search",
  ngrams: "N-grams",
  export: "Export",
  network_analysis: "Network",
  temporal_analysis: "Temporal",
};

const getStatusColor = (queue: { worker_online: boolean; active_tasks: number; queued_tasks: number }) => {
  if (!queue.worker_online) return "text-gray-400";
  if (queue.active_tasks > 0) return "text-green-500 animate-pulse";
  if (queue.queued_tasks > 0) return "text-yellow-500";
  return "text-gray-400";
};

const getStatusIcon = (queue: { worker_online: boolean; active_tasks: number; queued_tasks: number }) => {
  if (!queue.worker_online) return mdiCloseCircle;
  if (queue.active_tasks > 0) return mdiLoading;
  if (queue.queued_tasks > 0) return mdiClockOutline;
  return mdiCheckCircle;
};

const getTooltipContent = (
  name: string,
  queue: { worker_online: boolean; active_tasks: number; queued_tasks: number }
) => {
  if (!queue.worker_online) {
    return `${name}: Offline`;
  }
  if (queue.active_tasks > 0) {
    return `${name}: Processing ${queue.active_tasks} task${queue.active_tasks > 1 ? "s" : ""}`;
  }
  if (queue.queued_tasks > 0) {
    return `${name}: ${queue.queued_tasks} queued`;
  }
  return `${name}: Ready`;
};

export const MLProcessingStatus = () => {
  const { data: status, isLoading, isError } = useMLProcessingStatus();

  if (isLoading || isError) {
    return null;
  }

  // Show only key services: sentiment, ner, topic_modeling, classification
  const keyServices = ["sentiment", "ner", "topic_modeling", "classification"];
  const activeQueues = keyServices.filter((key) => status?.queues[key]);

  if (!status || activeQueues.length === 0) {
    return null;
  }

  const hasActivity = status.total_active > 0 || status.total_queued > 0;

  return (
    <div className="flex items-center space-x-2">
      {/* Overall status indicator */}
      {hasActivity && (
        <Tippy
          content={`${status.total_active} active, ${status.total_queued} queued`}
          placement="bottom"
        >
          <div className="flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            <Icon
              path={mdiLoading}
              size={0.6}
              className="mr-1 animate-spin text-green-600"
            />
            Processing
          </div>
        </Tippy>
      )}

      {/* Individual service indicators */}
      <div className="flex items-center space-x-1">
        {activeQueues.map((key) => {
          const queue = status.queues[key];
          const label = ML_SERVICE_LABELS[key] || key;

          return (
            <Tippy
              key={key}
              content={getTooltipContent(label, queue)}
              placement="bottom"
            >
              <div
                className={clsx(
                  "flex h-6 w-6 items-center justify-center rounded-full",
                  queue.worker_online
                    ? queue.active_tasks > 0
                      ? "bg-green-100"
                      : queue.queued_tasks > 0
                        ? "bg-yellow-100"
                        : "bg-gray-100"
                    : "bg-gray-100"
                )}
              >
                <Icon
                  path={getStatusIcon(queue)}
                  size={0.5}
                  className={clsx(
                    getStatusColor(queue),
                    queue.active_tasks > 0 && "animate-spin"
                  )}
                />
              </div>
            </Tippy>
          );
        })}
      </div>
    </div>
  );
};
