import clsx from "clsx";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";

type AutocompleteDropdownProps = {
  inputValue: string;
  options: { label: string; value?: number }[];
  onSelect: (suggestion: { label: string; value?: number }) => void;
  maxSuggestions?: number;
};

export function AutocompleteDropdown({
  inputValue,
  options,
  onSelect,
  maxSuggestions = 5,
}: AutocompleteDropdownProps) {
  const [suggestions, setSuggestions] = useState<
    { label: string; value?: number }[]
  >([]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        // If value is "", don't show suggestions
        if (!value) {
          setSuggestions([]);
          return;
        }

        const lowercaseValue = value.toLowerCase();

        const matches = options
          // First find options that include the search string
          .filter((option) =>
            option.label.toLowerCase().includes(lowercaseValue),
          )
          // Sort by how early the match appears in the option
          .sort((a, b) => {
            const aIndex = a.label.toLowerCase().indexOf(lowercaseValue);
            const bIndex = b.label.toLowerCase().indexOf(lowercaseValue);
            return aIndex - bIndex;
          })
          .slice(0, maxSuggestions);

        // If there's only one suggestion and it's the same as the input value,
        // hide it. If there are multiple options though, we want to make
        // transparent that they are vailable.
        if (
          matches.length === 1 &&
          matches[0].label.toLowerCase() === lowercaseValue
        ) {
          setSuggestions([]);
        } else {
          setSuggestions(matches);
        }
      }, 150),
    [options, maxSuggestions],
  );

  // Update suggestions when input value changes
  useEffect(() => {
    debouncedSearch(inputValue);
    return () => debouncedSearch.cancel();
  }, [inputValue, debouncedSearch]);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <ol className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
        {suggestions.map((suggestion, index) => (
          <li
            key={suggestion.label}
            className={clsx(
              "flex cursor-pointer items-center justify-between gap-2 truncate px-3 py-1 text-sm hover:bg-gray-100",
              index === 0 && "rounded-t-md",
              index === suggestions.length - 1 && "rounded-b-md",
            )}
            onClick={() => {
              onSelect(suggestion);
            }}
          >
            <span className="truncate">{suggestion.label}</span>
            {suggestion.value && (
              <span className="text-xs text-gray-700">{suggestion.value}</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
