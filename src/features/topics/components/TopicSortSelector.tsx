import { Menu } from "@headlessui/react";
import { mdiChevronDown } from "@mdi/js";
import Icon from "@mdi/react";

type SortField = "size" | "created_at" | "updated_at";
type SortOrder = "asc" | "desc";

interface TopicSortSelectorProps {
  currentSort: {
    sortBy: SortField;
    order: SortOrder;
  };
  onUpdateSort: (sortBy: SortField, order: SortOrder) => void;
}

export function TopicSortSelector({
  currentSort,
  onUpdateSort,
}: TopicSortSelectorProps) {
  const sortOptions: Array<{
    label: string;
    sortBy: SortField;
    order: SortOrder;
  }> = [
    { label: "Largest First", sortBy: "size", order: "desc" },
    { label: "Smallest First", sortBy: "size", order: "asc" },
    { label: "Newest First", sortBy: "created_at", order: "desc" },
    { label: "Oldest First", sortBy: "created_at", order: "asc" },
  ];

  const currentOption = sortOptions.find(
    (opt) =>
      opt.sortBy === currentSort.sortBy && opt.order === currentSort.order
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        {currentOption?.label || "Sort"}
        <Icon
          path={mdiChevronDown}
          size={0.8}
          className="-mr-1 text-gray-400"
        />
      </Menu.Button>

      <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="py-1">
          {sortOptions.map((option) => (
            <Menu.Item key={`${option.sortBy}-${option.order}`}>
              {({ active }) => (
                <button
                  onClick={() => onUpdateSort(option.sortBy, option.order)}
                  className={`${
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  } ${
                    currentOption?.label === option.label
                      ? "bg-indigo-50 text-indigo-900"
                      : ""
                  } block w-full px-4 py-2 text-left text-sm`}
                >
                  {option.label}
                </button>
              )}
            </Menu.Item>
          ))}
        </div>
      </Menu.Items>
    </Menu>
  );
}
