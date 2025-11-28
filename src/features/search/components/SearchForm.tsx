import { Transition } from "@headlessui/react";
import { mdiCloseCircle, mdiFilter, mdiMagnify } from "@mdi/js";
import clsx from "clsx";
import { debounce, isBoolean } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ChatFilter } from "./ChatFilter";
import { MessageFilter } from "./MessageFilter";
import { UserFilter } from "./UserFilter";

import { Button } from "components/Elements";
import { TextInputGroup } from "components/Form";
import { useChatNames } from "features/chats";
import { SaveSearch } from "features/saved-searches";
import {
  ActiveFilterBadges,
  FilterKeys,
  SearchFormInputs,
  UpdateFiltersOptions,
  FilterOptions,
} from "features/search";
import { createDisplayNameFromUser, useUserNames } from "features/users";

import { useDeepMemo } from "hooks/useDeepMemo";
import { GetChatsParams, GetMessagesParams, GetUsersParams } from "types";

const parseOutgoingValues = (params?: {
  [key: string]: any;
}): GetChatsParams | GetMessagesParams | GetUsersParams | undefined => {
  if (!params) {
    return params;
  }

  const sanitizeRecursive = (obj: { [key: string]: any }) => {
    const result: {
      [key: string]: string | number | true | number[] | string[];
    } = {};

    if (typeof obj !== "object") {
      return obj;
    }

    const keys = Object.keys(obj);
    keys.forEach((key) => {
      let value = obj[key];

      // skip falsy values
      if (
        value === undefined ||
        value === "" ||
        (isBoolean(value) && value === false) ||
        Number.isNaN(value)
      ) {
        return;
      }

      // recursivly remove falsy values
      if (Array.isArray(value)) {
        const recursiveResult = value
          .map((v) => sanitizeRecursive(v))
          .filter((v) => (typeof v === "object" ? Object.keys(v).length : v))
          .map((v) => (typeof v.value !== "undefined" ? v.value : v)); // make array flat

        if (!recursiveResult.length) {
          return;
        }

        value = recursiveResult;
      }

      result[key] = value;
    });
    return result;
  };

  return sanitizeRecursive(params);
};

type SearchFormProps = {
  filterKey: FilterKeys;
  filterOptions: FilterOptions;
  defaultFilterOptions?: FilterOptions;
  onFilterUpdate: (options: UpdateFiltersOptions) => void;
};

export const SearchForm = ({
  filterKey,
  filterOptions: incomingFilterOptions,
  defaultFilterOptions,
  onFilterUpdate,
}: SearchFormProps) => {
  const userNames = useUserNames();
  const chatNames = useChatNames();

  const parseIncomingFilterOptions = useCallback(
    (filterOptions: FilterOptions) => {
      return {
        chats: {
          ...filterOptions?.chats,
          tags: filterOptions?.chats?.tags?.map((tag) => ({
            value: tag,
          })),
        },
        messages: {
          ...filterOptions?.messages,
          from_user_ids: filterOptions?.messages?.from_user_ids?.map((id) => {
            const user = userNames.find((u) => u.id === id);
            return {
              value: id,
              label: user ? createDisplayNameFromUser(user) : "Unknown",
            };
          }),
          chat_ids: filterOptions?.messages?.chat_ids?.map((id) => ({
            value: id,
            label: chatNames.find((c) => c.id === id)?.title,
          })),
          tags: filterOptions?.messages?.tags?.map((tag) => ({
            value: tag,
          })),
          chat_tags: filterOptions?.messages?.chat_tags?.map((tag) => ({
            value: tag,
          })),
        },
        users: {
          ...filterOptions?.users,
        },
      };
    },
    [userNames, chatNames],
  );

  const parsedDefaultFilterOptions =
    defaultFilterOptions && parseIncomingFilterOptions(defaultFilterOptions);

  const form = useForm<SearchFormInputs>({
    mode: "onChange",
    defaultValues: parsedDefaultFilterOptions,
  });

  const filterOptions = useMemo(
    () => incomingFilterOptions,
    [incomingFilterOptions],
  );

  const parsedFilterOptions = useDeepMemo(
    parseIncomingFilterOptions(incomingFilterOptions),
  );

  const {
    watch,
    register,
    setValue,
    getValues,
    resetField,
    reset,
    formState: { errors, isValid },
  } = form;

  const filterOptionsKeys = Object.keys(filterOptions) as FilterKeys[];
  const [isShowingFilterPanel, setIsShowingFilterPanel] = useState(false);

  const handleFilterChange = useCallback(
    (key: FilterKeys) => {
      if (!isValid) {
        return;
      }

      onFilterUpdate({
        key,
        params: parseOutgoingValues(getValues(key)),
      } as UpdateFiltersOptions); // TODO: improve generic type hints
    },
    [getValues, isValid, onFilterUpdate],
  );

  const handleFilterChangeDebounced = useMemo(
    () => debounce(() => handleFilterChange(filterKey), 1000),
    [filterKey, handleFilterChange],
  );

  // watch input change and update params
  useEffect(() => {
    const subscription = watch(handleFilterChangeDebounced);
    return () => subscription.unsubscribe();
  }, [handleFilterChangeDebounced, watch]);

  // Update form values when filter options are changed by accessing store from outside
  useEffect(() => {
    for (const [filterKey, filterValues] of Object.entries(
      parsedFilterOptions,
    )) {
      if (filterValues) {
        for (const [optionKey, optionValue] of Object.entries(filterValues)) {
          setValue(`${filterKey}.${optionKey}` as any, optionValue);
        }
      }
    }
  }, [parsedFilterOptions, setValue]);

  // Apply default filter options to store on mount
  useEffect(() => {
    if (defaultFilterOptions) {
      onFilterUpdate({
        key: filterKey,
        params: parseOutgoingValues(defaultFilterOptions[filterKey]),
      } as UpdateFiltersOptions);
    }

    // Reset form and state on unmount to prevent them being reused when
    // switching between saved searches.
    return () => {
      reset();
      // TODO: I am not sure why this helps when switching between saved searches
      // but has no effect on the form state of the regular search. Which is intended
      // but still weird.
      onFilterUpdate({
        key: filterKey,
        params: {},
      } as UpdateFiltersOptions);
    };
  }, []);

  // Destroy debounce handler on unmount
  useEffect(() => {
    return () => handleFilterChangeDebounced.cancel();
  }, [handleFilterChangeDebounced]);

  return (
    <>
      <div className="flex flex-col gap-2 md:flex-row">
        <div className="flex w-full">
          {filterOptionsKeys.map((key) => (
            <TextInputGroup
              key={key}
              id={`search-field-${key}`}
              className={clsx("w-full lg:justify-end", {
                hidden: key !== filterKey,
              })}
              hiddenLabel
              type="search"
              label="Search text"
              startIcon={mdiMagnify}
              placeholder={`Type to search for ${key}…`}
              registration={register(`${key}.search_query`)}
              error={errors[key]?.search_query}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {filterKey === "messages" ? (
            <div className="w-full lg:w-auto">
              <SaveSearch queryParams={filterOptions.messages} />
            </div>
          ) : null}
          <Button
            startIcon={isShowingFilterPanel ? mdiCloseCircle : mdiFilter}
            variant={isShowingFilterPanel ? "secondaryActive" : "secondary"}
            onClick={() => setIsShowingFilterPanel((isShowing) => !isShowing)}
            className="w-full lg:w-auto"
          >
            Filter
          </Button>
        </div>
      </div>
      {/* Filter panel */}
      <div className="-mx-4 mt-4 sm:mx-0">
        <Transition
          show={isShowingFilterPanel}
          unmount={false}
          as="div"
          className="mb-4 bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6"
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <FormProvider {...form}>
            <h2 className="text-lg font-bold sm:text-xl">Filter</h2>
            <ChatFilter
              className={clsx(filterKey === "chats" ? "block" : "hidden")}
            />
            <MessageFilter
              className={clsx(filterKey === "messages" ? "block" : "hidden")}
            />
            <UserFilter
              className={clsx(filterKey === "users" ? "block" : "hidden")}
            />
          </FormProvider>
        </Transition>
      </div>
      <ActiveFilterBadges
        activeOptions={filterOptions[filterKey]}
        ignoreKeys={["sort_by", "order"]}
        onRemoveFilter={(key) => {
          resetField(`${filterKey}.${key}` as any);
        }}
      />
    </>
  );
};
