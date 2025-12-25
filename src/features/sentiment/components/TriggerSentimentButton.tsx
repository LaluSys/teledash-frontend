import { useState } from "react";
import { Button } from "components/Elements";
import { useTriggerSentimentAnalysis } from "../api";
import { useNotificationStore } from "stores/notifications";
import { useChats } from "features/chats/api";

export function TriggerSentimentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(true);
  const [config, setConfig] = useState({
    method: "vader" as "vader" | "textblob",
    reanalyze: false
  });

  const addNotification = useNotificationStore((state) => state.addNotification);
  const { data: chatsData } = useChats({ params: { limit: 1000 } });

  const chats = chatsData?.pages.flatMap((page) => page.data) || [];

  const triggerSentimentMutation = useTriggerSentimentAnalysis({
    config: {
      onSuccess: (data) => {
        addNotification({
          type: "success",
          title: "Sentiment Analysis Started",
          message: data.message || "Sentiment analysis job has been triggered successfully.",
        });
        setIsOpen(false);
        setSelectedChatIds([]);
        setSelectAll(true);
      },
      onError: (error: any) => {
        const detail = error.response?.data?.detail;
        let errorMessage = "An error occurred while triggering sentiment analysis.";
        
        if (typeof detail === "string") {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(", ");
        } else if (typeof detail === "object" && detail !== null) {
          errorMessage = detail.msg || detail.message || JSON.stringify(detail);
        }

        addNotification({
          type: "error",
          title: "Failed to Start Sentiment Analysis",
          message: errorMessage,
        });
      },
    },
  });

  const handleTrigger = () => {
    triggerSentimentMutation.mutate({
      chat_ids: selectAll ? undefined : selectedChatIds,
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
        Analyze Sentiment
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
                Trigger Sentiment Analysis
              </h3>

              <p className="text-sm text-gray-500 mb-6">
                Analyze the emotional tone of messages. This process may take several minutes
                depending on the number of messages selected.
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
                    Analyze all chats
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

              <div className="mb-6">
                 <label className="block text-sm font-medium text-gray-700">Method</label>
                 <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    value={config.method}
                    onChange={(e) => setConfig({ ...config, method: e.target.value as "vader" | "textblob" })}
                  >
                    <option value="vader">VADER (Rule-based, good for social media)</option>
                    <option value="textblob">TextBlob (Polarity-based)</option>
                  </select>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.reanalyze}
                    onChange={(e) => setConfig({ ...config, reanalyze: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Re-analyze existing messages</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                  size="sm"
                  disabled={triggerSentimentMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleTrigger}
                  variant="primary"
                  size="sm"
                  isLoading={triggerSentimentMutation.isPending}
                  disabled={!selectAll && selectedChatIds.length === 0}
                >
                  Start Analysis
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
