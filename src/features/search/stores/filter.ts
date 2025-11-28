import { create } from "zustand";

import { FilterKeys, FilterValues, UpdateFiltersOptions } from "..";

type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

export type FilterOptions = AtLeastOne<{
  [key in FilterKeys]: FilterValues<key> | undefined;
}>;

export type FilterStore = {
  options: { [key: string]: FilterOptions };
  createFilter: ({
    id,
    options,
  }: {
    id: string;
    options: FilterOptions;
  }) => void;
  getFilterOptions: (id: string) => FilterOptions | undefined;
  setFilterOptions: (id: string, options: UpdateFiltersOptions) => void;
  // removeFilterOption: <T>(key: T, value: FilterValues<T>) => void;
};

export const useFilterStore = create<FilterStore>((set, get) => ({
  options: {
    search: { chats: undefined, messages: undefined, users: undefined },
    savedSearches: { messages: undefined },
  },

  createFilter: ({ id, options }) =>
    set((state) => {
      return {
        options: {
          ...state.options,
          [id]: options,
        },
      };
    }),

  getFilterOptions: (id) => get().options[id],

  setFilterOptions: (id, { key, params }) =>
    set((state) => ({
      options: {
        ...state.options,
        [id]: { ...state.options[id], [key]: params },
      },
    })),
  // removeFilterOption: (key, value) => set((state) => ({})),
}));
