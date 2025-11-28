import { mdiTrashCan } from "@mdi/js";

import { Button, ConfirmationDialog } from "components/Elements";
import { useDeleteSavedSearch } from "features/saved-searches";

import { useNotificationStore } from "stores/notifications";
import { SavedSearch } from "types";

type DeleteSavedSearchProps = {
  savedSearch: SavedSearch;
};

export function DeleteSavedSearch({ savedSearch }: DeleteSavedSearchProps) {
  const { addNotification } = useNotificationStore();

  const deleteSavedSearchMutation = useDeleteSavedSearch({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Saved search deleted.",
        });
      },
    },
  });

  return (
    <ConfirmationDialog
      triggerButton={(open) => (
        <Button
          size="sm"
          variant="secondary"
          startIcon={mdiTrashCan}
          className="flex-shrink-0"
          onClick={open}
        >
          <span>Delete</span>
        </Button>
      )}
      confirmButton={
        <Button
          type="button"
          variant="danger"
          isLoading={deleteSavedSearchMutation.isPending}
          onClick={async () => {
            try {
              await deleteSavedSearchMutation.mutateAsync({
                id: savedSearch.id,
              });
            } catch (error) {
              // TODO: Display the error message.
              console.error(error);
            }
          }}
          className="w-full"
        >
          Delete
        </Button>
      }
      title="Delete Saved Search"
      body={`Are you sure you want to delete saved search “${savedSearch.name}”?`}
    />
  );
}
