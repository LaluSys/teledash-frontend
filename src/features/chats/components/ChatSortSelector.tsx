import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiSortAscending,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
  mdiSortDescending,
  mdiSortNumericAscending,
  mdiSortNumericDescending,
} from "@mdi/js";

import {
  PassThroughSortSelectorProps,
  SortSelector,
} from "components/Elements";
import { ChatSortBy } from "types";

export const ChatSortSelector = ({
  currentSort,
  onUpdateSort,
  ignoreSortByOptions,
  className,
}: PassThroughSortSelectorProps<ChatSortBy>) => {
  return SortSelector<ChatSortBy>({
    currentSort,
    onUpdateSort,
    defaultSortOrders: {
      "title.keyword": "asc",
      members_count: "desc",
      updated_at: "desc",
      score: "desc",
    },
    sortByOptions: ["title.keyword", "members_count", "updated_at", "score"],
    sortByLabels: {
      "title.keyword": "Title",
      members_count: "Members",
      updated_at: "Updated At",
      score: "Relevance",
    },
    sortByIcons: {
      "title.keyword": {
        asc: mdiSortAlphabeticalAscending,
        desc: mdiSortAlphabeticalDescending,
      },
      members_count: {
        asc: mdiSortNumericAscending,
        desc: mdiSortNumericDescending,
      },
      updated_at: {
        asc: mdiSortCalendarAscending,
        desc: mdiSortCalendarDescending,
      },
      score: { asc: mdiSortAscending, desc: mdiSortDescending },
    },
    ignoreSortByOptions,
    className,
  });
};
