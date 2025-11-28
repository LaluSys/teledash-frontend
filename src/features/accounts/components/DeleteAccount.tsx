import { mdiTrashCan } from "@mdi/js";
import { cloneElement } from "react";

import { Button, ConfirmationDialog } from "components/Elements";
import { useDeleteAccount } from "features/accounts";

import { useNotificationStore } from "stores/notifications";
import { Account } from "types";

type DeleteAccountProps = {
  account: Account;
  triggerButton?: (
    open: () => void,
    props: { disabled: boolean },
  ) => React.ReactElement;
};

export function DeleteAccount({ account, triggerButton }: DeleteAccountProps) {
  const { addNotification } = useNotificationStore();

  const deleteAccountMutation = useDeleteAccount({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: "success",
          title: "Account deleted.",
        });
      },
    },
  });

  const defaultTriggerButton = (open: () => void) => (
    <Button
      size="sm"
      variant="secondary"
      startIcon={mdiTrashCan}
      onClick={open}
      disabled={account.is_superuser}
    >
      <span>Delete</span>
    </Button>
  );

  return (
    <ConfirmationDialog
      title="Delete Account"
      triggerButton={(open) =>
        cloneElement(
          triggerButton?.(open, { disabled: account.is_superuser }) ??
            defaultTriggerButton(open),
          {
            disabled: account.is_superuser,
          },
        )
      }
      confirmButton={
        <Button
          type="button"
          variant="danger"
          isLoading={deleteAccountMutation.isPending}
          onClick={async () => {
            try {
              await deleteAccountMutation.mutateAsync({ id: account.id });
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
      body={`Are you sure you want to delete “${account.first_name + " " + account.last_name + "(" + account.email + ")"}”?`}
    />
  );
}
