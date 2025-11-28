import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiSortNumericAscending,
  mdiSortNumericDescending,
} from "@mdi/js";
import {
  PassThroughSortSelectorProps,
  SortSelector,
} from "components/Elements";
import { OrderEnum } from "types";

export type TagSortBy = "name" | "count";

export function TagSortSelector({
  currentSort,
  onUpdateSort,
  className,
}: PassThroughSortSelectorProps<TagSortBy>) {
  return SortSelector<TagSortBy>({
    currentSort,
    onUpdateSort,
    defaultSortOrders: {
      name: "asc",
      count: "desc",
    },
    sortByOptions: ["name", "count"],
    sortByLabels: {
      name: "Name",
      count: "Count",
    },
    sortByIcons: {
      name: {
        asc: mdiSortAlphabeticalAscending,
        desc: mdiSortAlphabeticalDescending,
      },
      count: { asc: mdiSortNumericAscending, desc: mdiSortNumericDescending },
    },
    className,
  });
}
