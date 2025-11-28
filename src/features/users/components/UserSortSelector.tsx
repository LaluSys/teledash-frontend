import {
  mdiMagnify,
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiSortNumericAscending,
  mdiSortNumericDescending,
} from "@mdi/js";

import {
  PassThroughSortSelectorProps,
  SortSelector,
} from "components/Elements";
import { UserSortBy } from "types";

export const UserSortSelector = ({
  currentSort,
  onUpdateSort,
  ignoreSortByOptions,
  className,
}: PassThroughSortSelectorProps<UserSortBy>) => {
  return SortSelector<UserSortBy>({
    currentSort,
    onUpdateSort,
    defaultSortOrders: {
      updated_at: "desc",
      "username.keyword": "asc",
      score: "desc",
    },
    sortByOptions: ["username.keyword", "updated_at", "score"],
    sortByLabels: {
      "username.keyword": "Username",
      updated_at: "Created At",
      score: "Relevance",
    },
    sortByIcons: {
      "username.keyword": {
        asc: mdiSortAlphabeticalAscending,
        desc: mdiSortAlphabeticalDescending,
      },
      updated_at: {
        asc: mdiSortNumericAscending,
        desc: mdiSortNumericDescending,
      },
      score: {
        asc: mdiMagnify,
        desc: mdiMagnify,
      },
    },
    ignoreSortByOptions,
    className,
  });
};
