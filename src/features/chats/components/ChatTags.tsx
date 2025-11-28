import { useCallback, useContext } from "react";

import { Tags, TagsProps } from "components/Elements";
import { useChatsStats, useUpdateChat } from "features/chats";
import {
  UpdateFiltersOptions,
  useFilterStore,
  FilterContext,
} from "features/search";

type ChatTagsProps = TagsProps & {
  chatId: number;
};

export function ChatTags({ chatId, tags, ...props }: ChatTagsProps) {
  const updateChatMutation = useUpdateChat();

  const availableTags = useChatsStats().data?.tags?.map((tag) => tag.value);

  async function addTag(tag: string) {
    const tagLower = tag.toLowerCase();

    if (!tags?.some((t) => t.toLowerCase() === tagLower)) {
      return updateChatMutation.mutate({
        id: chatId,
        data: { tags: [...(tags ?? []), tag] },
      });
    }

    return Promise.resolve();
  }

  async function removeTag(tag: string) {
    return updateChatMutation.mutate({
      id: chatId,
      data: { tags: tags?.filter((t) => t !== tag) },
    });
  }

  return (
    <Tags
      {...props}
      tags={tags}
      addTag={addTag}
      removeTag={removeTag}
      availableTags={availableTags}
    />
  );
}

export const ChatListTags = (props: TagsProps) => {
  const activeFilter = useContext(FilterContext);

  const filterOptions = useFilterStore((state) =>
    state.getFilterOptions(activeFilter),
  );

  const setFilterOptions = useFilterStore((state) => state.setFilterOptions);

  const updateFilters = useCallback(
    (options: UpdateFiltersOptions) => {
      setFilterOptions(activeFilter, options);
    },
    [setFilterOptions, activeFilter],
  );

  function applyTagFilter(tag: string) {
    const tags = filterOptions?.chats?.tags ?? [];
    if (!tags.includes(tag)) {
      updateFilters({
        key: "chats",
        params: { ...filterOptions?.chats, tags: [...tags, tag] },
      });
    }
  }

  return <Tags {...props} onClick={applyTagFilter} />;
};
