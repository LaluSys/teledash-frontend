import { useState } from "react";
import { Button } from "components/Elements";
import { useTriggerTopicModeling } from "../api";
import { useNotificationStore } from "stores/notifications";
import { useChats } from "features/chats/api";

export function TriggerTopicModelingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [config, setConfig] = useState({
    method: "nmf" as "nmf" | "lda",
    max_topics: 10,
    min_topic_size: 10,
    message_limit: 10000
  });

  const addNotification = useNotificationStore((state) => state.addNotification);
  const { data: chatsData } = useChats({ params: { limit: 1000 } });

  const chats = chatsData?.pages.flatMap((page) => page.data) || [];

  const triggerTopicsMutation = useTriggerTopicModeling({
    config: {
      onSuccess: (data) => {
        addNotification({
          type: "success",
          title: "Topic Modeling Started",
          message: data.message || "Topic modeling job has been triggered successfully.",
        });
        setIsOpen(false);
        setSelectedChatIds([]);
        setSelectAll(true);
      },
      onError: (error: any) => {
        const detail = error.response?.data?.detail;
        let errorMessage = "An error occurred while triggering topic modeling.";
        
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
        } else if (typeof detail === "object" && detail !== null) {
          errorMessage = detail.msg || detail.message || JSON.stringify(detail);
        }

        addNotification({
          type: "error",
          title: "Failed to Start Topic Modeling",
          message: errorMessage,
        });
      },
    },
  });

  const handleTrigger = () => {
    triggerTopicsMutation.mutate({
      chat_ids: selectAll ? undefined : selectedChatIds,
      min_messages: 100,
      ...config
    });
  };

  const toggleChat = (chatId: string) => {
    setSelectedChatIds((prev) =>
      prev.includes(chatId)
        ? prev.filter((id) => id !== chatId)
        : [...prev, chatId]
    );
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedChatIds([]);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="primary"
        size="sm"
      >
        Run Topic Modeling
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsOpen(false)}
            />

            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Trigger Topic Modeling
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Discover and analyze topics in your messages using machine learning.
                This process may take several minutes depending on the number of messages.
              </p>

              {/* Select All Checkbox */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={(e) => handleSelectAllChange(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Model topics from all chats
                  </span>
                </label>
              </div>

              {/* Chat Selection */}
              {!selectAll && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Chats ({selectedChatIds.length} selected)
                  </label>
                  <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2 space-y-2">
                    {chats.length === 0 ? (
                      <p className="text-sm text-gray-500 p-2">No chats available</p>
                    ) : (
                      chats.map((chat) => (
                        <label key={chat.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedChatIds.includes(String(chat.id))}
                            onChange={() => toggleChat(String(chat.id))}
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                          <span className="ml-2 text-sm text-gray-900">{chat.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Algorithm</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={config.method}
                    onChange={(e) => setConfig({ ...config, method: e.target.value as "nmf" | "lda" })}
                  >
                    <option value="nmf">NMF (Non-negative Matrix Factorization)</option>
                    <option value="lda">LDA (Latent Dirichlet Allocation)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Topics</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={config.max_topics}
                    onChange={(e) => setConfig({ ...config, max_topics: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Min Topic Size (messages)</label>
                  <input
                    type="number"
                    min="2"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={config.min_topic_size}
                    onChange={(e) => setConfig({ ...config, min_topic_size: parseInt(e.target.value) })}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Limit Messages (for speed)</label>
                  <input
                    type="number"
                    min="100"
                    step="1000"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={config.message_limit}
                    onChange={(e) => setConfig({ ...config, message_limit: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                  size="sm"
                  disabled={triggerTopicsMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTrigger}
                  variant="primary"
                  size="sm"
                  isLoading={triggerTopicsMutation.isPending}
                  disabled={!selectAll && selectedChatIds.length === 0}
                >
                  Start Modeling
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
