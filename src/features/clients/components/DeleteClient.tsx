import { mdiTrashCan } from "@mdi/js";

import { Button, ConfirmationDialog } from "components/Elements";
import { useDeleteClient } from "features/clients";

import { useNotificationStore } from "stores/notifications";
import { ClientOut } from "types";

type DeleteClientProps = {
  client: ClientOut;
};

export function DeleteClient({ client }: DeleteClientProps) {
  const { addNotification } = useNotificationStore();

  const deleteClientMutation = useDeleteClient({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Client deleted.",
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
          <span>Remove</span>
        </Button>
      )}
      confirmButton={
        <Button
          type="button"
          variant="danger"
          isLoading={deleteClientMutation.isPending}
          onClick={async () => {
            try {
              await deleteClientMutation.mutateAsync({ id: client.id });
            } catch (error) {
              // TODO: Display the error message.
              console.error(error);
            }
          }}
          className="w-full"
        >
          Remove
        </Button>
      }
      title="Remove Telegram Account"
      body={`Are you sure you want to delete “${client.title}”?`}
    />
  );
}
