import {
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
import { MessageSortBy } from "types";

export const MessageSortSelector = ({
  currentSort,
  onUpdateSort,
  ignoreSortByOptions,
  className,
}: PassThroughSortSelectorProps<MessageSortBy>) => {
  return SortSelector<MessageSortBy>({
    currentSort,
    onUpdateSort,
    defaultSortOrders: {
      date: "desc",
      score: "desc",
      "classification.score_pos": "desc",
    },
    sortByOptions: ["date", "score", "classification.score_pos"],
    sortByLabels: {
      date: "Date",
      score: "Relevance",
      "classification.score_pos": "Classification Rating",
    },
    sortByIcons: {
      date: {
        asc: mdiSortCalendarAscending,
        desc: mdiSortCalendarDescending,
      },
      score: { asc: mdiSortAscending, desc: mdiSortDescending },
      "classification.score_pos": {
        asc: mdiSortNumericAscending,
        desc: mdiSortNumericDescending,
      },
    },
    ignoreSortByOptions,
    className,
  });
};
