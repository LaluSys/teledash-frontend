import React, { useState, useMemo } from "react";
import { Checkbox, Input, Spin, Alert } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useChats } from "features/chats/api/getChats";

interface ChatMultiSelectProps {
  selectedChatIds: string[];
  onSelectionChange: (chatIds: string[]) => void;
  selectAll: boolean;
  onSelectAllChange: (selectAll: boolean) => void;
}

export const ChatMultiSelect: React.FC<ChatMultiSelectProps> = ({
  selectedChatIds,
  onSelectionChange,
  selectAll,
  onSelectAllChange,
}) => {
  const { data, isLoading } = useChats({
    params: {
      limit: 10000, // Get all chats
    },
  });
  const [searchText, setSearchText] = useState("");

  // Flatten infinite query pages into single array
  const allChats = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.data);
  }, [data]);

  const filteredChats = useMemo(() => {
    if (!allChats.length) return [];
    if (!searchText) return allChats;
    return allChats.filter(
      (chat) =>
        chat.title?.toLowerCase().includes(searchText.toLowerCase()) ||
        String(chat.id).includes(searchText)
    );
  }, [allChats, searchText]);

  const handleChatToggle = (chatId: string) => {
    if (selectedChatIds.includes(chatId)) {
      onSelectionChange(selectedChatIds.filter((id) => id !== chatId));
    } else {
      onSelectionChange([...selectedChatIds, chatId]);
    }
  };

  if (isLoading) {
    return <Spin tip="Loading chats..." />;
  }

  return (
    <div className="chat-multi-select">
      <Checkbox
        checked={selectAll}
        onChange={(e: any) => onSelectAllChange(e.target.checked)}
        style={{ marginBottom: 16 }}
      >
        Select All Chats
      </Checkbox>

      {!selectAll && (
        <>
          <Input
            placeholder="Search chats..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
            style={{ marginBottom: 12 }}
          />

          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            {filteredChats.length === 0 ? (
              <Alert message="No chats found" type="info" />
            ) : (
              filteredChats.map((chat) => (
                <div key={chat.id} style={{ marginBottom: 8 }}>
                  <Checkbox
                    checked={selectedChatIds.includes(String(chat.id))}
                    onChange={() => handleChatToggle(String(chat.id))}
                  >
                    {chat.title || `Chat ${String(chat.id).slice(0, 8)}...`}
                  </Checkbox>
                </div>
              ))
            )}
          </div>

          <div style={{ marginTop: 12, color: "#666" }}>
            {selectedChatIds.length} chat(s) selected
          </div>
        </>
      )}
    </div>
  );
};
