import { clsx } from "clsx";
import { Button } from "components/Elements/Button";
import { TagSortBy } from "features/tags";
import { startCase } from "lodash";
import { useEffect, useState } from "react";
import { OrderEnum, SortBy } from "types";

// Add TagSortBy which is exclusive to the frontend.
type ExtendedSortBy = SortBy | TagSortBy;

type SortSelectorProps<T extends ExtendedSortBy> = {
  currentSort: { sortBy: T; order: OrderEnum };
  onUpdateSort: (sortBy: T, order: OrderEnum) => void;
  defaultSortOrders: Record<T, OrderEnum>;
  sortByOptions: T[];
  sortByLabels: Record<T, string>;
  sortByIcons: Record<T, { asc: string; desc: string }>;
  ignoreSortByOptions?: T[];
  className?: string;
};

export function SortSelector<T extends ExtendedSortBy>({
  currentSort,
  onUpdateSort,
  defaultSortOrders,
  sortByOptions,
  sortByLabels,
  sortByIcons,
  ignoreSortByOptions,
  className,
}: SortSelectorProps<T>) {
  const [sortOrders, setSortOrders] =
    useState<Record<T, OrderEnum>>(defaultSortOrders);

  // Filter out ignored options
  const filteredOptions = sortByOptions.filter(
    (option) => !ignoreSortByOptions?.includes(option),
  );

  const handleSortClick = (sortBy: T) => {
    const nextOrder =
      currentSort.sortBy === sortBy
        ? currentSort.order === "asc"
          ? "desc"
          : "asc"
        : sortOrders[sortBy];

    onUpdateSort(sortBy, nextOrder);
  };

  useEffect(() => {
    setSortOrders((prev) => ({
      ...prev,
      [currentSort.sortBy]: currentSort.order,
    }));
  }, [currentSort]);

  return (
    <div className={clsx("whitespace-nowrap", className)}>
      {filteredOptions.map((sortBy, index) => {
        return (
          <Button
            key={sortBy}
            variant="secondary"
            size="xs"
            onClick={() => handleSortClick(sortBy)}
            startIcon={sortByIcons[sortBy][sortOrders[sortBy]]}
            className={clsx(
              currentSort.sortBy === sortBy
                ? "border-indigo-500 text-indigo-600"
                : "border-gray-300 text-gray-900",
              "rounded-none",
              "focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
              "border bg-white shadow-sm hover:bg-gray-50",
              index === 0 && "rounded-bl-md rounded-tl-md",
              index === filteredOptions.length - 1 &&
                "rounded-br-md rounded-tr-md",
            )}
          >
            {sortByLabels[sortBy] || startCase(sortBy)}
          </Button>
        );
      })}
    </div>
  );
}

// To be used by more specific impelementations of SortSelector.
export type PassThroughSortSelectorProps<T extends ExtendedSortBy> = Pick<
  SortSelectorProps<T>,
  "currentSort" | "onUpdateSort" | "className" | "ignoreSortByOptions"
>;
