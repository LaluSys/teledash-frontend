import { mdiBookmarkCheck, mdiBookmarkPlus } from "@mdi/js";
import Tippy from "@tippyjs/react";
import { useEffect, useState } from "react";

import {
  Button,
  DialogCloseButton,
  DisclosureDialog,
} from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import {
  SaveSearchInput,
  saveSearchInputSchema,
  useSaveSearch,
  useSavedSearchesList,
} from "features/saved-searches";

import { useNotificationStore } from "stores/notifications";
import { GetMessagesParams } from "types";

type SaveSearchFormProps = {
  queryParams: GetMessagesParams;
  onSuccess: () => void;
};

function SaveSearchForm({ queryParams, onSuccess }: SaveSearchFormProps) {
  const { addNotification } = useNotificationStore();

  const saveSearchMutation = useSaveSearch({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Search saved.",
        });
      },
    },
  });

  return (
    <Form<SaveSearchInput, typeof saveSearchInputSchema>
      onSubmit={async (data) => {
        try {
          await saveSearchMutation.mutateAsync({
            data: {
              name: data.name,
              params: queryParams,
            },
          });
        } catch (error) {
          // TODO: Display the error message inside of the form.
          console.error(error);
        }
      }}
      options={{
        defaultValues: {
          name: queryParams?.search_query ?? "",
        },
      }}
      schema={saveSearchInputSchema}
      className="w-full"
    >
      {({ register, formState }) => {
        return (
          <>
            <TextInputGroup
              id="name"
              type="text"
              label="Name"
              placeholder="Enter a name for this search"
              description="An arbitrary name to identify this search."
              registration={register("name")}
              error={formState.errors["name"]}
            />
            <Button
              disabled={!formState.isValid}
              isLoading={saveSearchMutation.isPending}
              type="submit"
              className="w-full"
            >
              Save
            </Button>
            <DialogCloseButton
              as={Button}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </DialogCloseButton>
          </>
        );
      }}
    </Form>
  );
}

export function SaveSearch({
  queryParams,
}: {
  queryParams: GetMessagesParams;
}) {
  const { data: savedSearches } = useSavedSearchesList();
  const [queryParamsExist, setQueryParamsExist] = useState<boolean>();

  useEffect(() => {
    function findSavedSearch(params: GetMessagesParams) {
      return savedSearches?.find((savedSearch) => {
        // TODO: Hacky. Probably will not work in some cases. Either write
        // custom equality check function or use fast-deep-equal,
        // lodash-isequal, dequal or w/e.
        return JSON.stringify(savedSearch.params) === JSON.stringify(params);
      });
    }

    setQueryParamsExist(
      queryParams &&
        (!!findSavedSearch(queryParams) ||
          Object.keys(queryParams).filter(
            (key) =>
              // Don't consider these params as relevant for saving.
              ![
                "search_type",
                "sort_by",
                "order",
                "include",
                "exclude",
                "skip",
                "limit",
              ].includes(key),
          ).length === 0),
    );
  }, [queryParams, savedSearches]);

  // TODO: Allow saving semantic search queries.
  const isSemantic =
    queryParams?.search_type === "semantic_text" ||
    queryParams?.search_type === "semantic_image";

  return (
    <DisclosureDialog
      title="Save search"
      triggerButton={(open) => (
        <Tippy content="Save this search">
          <Button
            startIcon={queryParamsExist ? mdiBookmarkCheck : mdiBookmarkPlus}
            variant={"secondary"}
            // TODO: This might be costly. Analyze performance.
            disabled={queryParamsExist ?? isSemantic}
            className="w-full"
            onClick={open}
          >
            Save
          </Button>
        </Tippy>
      )}
    >
      {({ close }) => (
        <SaveSearchForm queryParams={queryParams} onSuccess={close} />
      )}
    </DisclosureDialog>
  );
}
