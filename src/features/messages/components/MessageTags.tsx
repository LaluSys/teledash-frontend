import { useCallback, useContext } from "react";

import { Tags, TagsProps } from "components/Elements";
import { useUpdateMessage } from "features/messages";
import {
  UpdateFiltersOptions,
  useFilterStore,
  FilterContext,
} from "features/search";
import { useTags } from "features/tags";

type MessageTagsProps = TagsProps & {
  messageId: string;
};

export function MessageTags({ messageId, tags }: MessageTagsProps) {
  const updateMessageMutation = useUpdateMessage();

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

  async function addTag(tag: string) {
    const tagLower = tag.toLowerCase();

    if (!tags?.some((t) => t.toLowerCase() === tagLower)) {
      return updateMessageMutation.mutate({
        id: messageId,
        data: { tags: [...(tags ?? []), tag] },
      });
    }

    return Promise.resolve();
  }

  async function removeTag(tag: string) {
    return updateMessageMutation.mutate({
      id: messageId,
      data: { tags: tags?.filter((t) => t !== tag) },
    });
  }

  function applyTagFilter(tag: string) {
    const tags = filterOptions?.messages?.tags ?? [];
    if (!tags.includes(tag)) {
      updateFilters({
        key: "messages",
        params: { ...filterOptions?.messages, tags: [...tags, tag] },
      });
    }
  }

  const { data: availableTags = [] } = useTags();

  return (
    <Tags
      tags={tags}
      addTag={addTag}
      removeTag={removeTag}
      availableTags={availableTags}
      onClick={applyTagFilter}
    />
  );
}
