import { mdiPencil } from "@mdi/js";

import { Button, DisclosureDialog } from "components/Elements";
import { UpdateAccountForm, UpdateCurrentAccountForm } from "features/accounts";
import React from "react";

import { Account } from "types";

type UpdateAccountProps = {
  account: Account;
  triggerButton?: (open: () => void) => React.ReactElement;
};

export function UpdateAccount({ account, triggerButton }: UpdateAccountProps) {
  const defaultTriggerButton = (open: () => void) => (
    <Button
      size="sm"
      variant="secondary"
      startIcon={mdiPencil}
      className="flex-shrink-0"
      onClick={open}
    >
      <span>Edit</span>
    </Button>
  );

  return (
    <DisclosureDialog
      title="Edit account"
      triggerButton={triggerButton ?? defaultTriggerButton}
    >
      {({ close }) => <UpdateAccountForm account={account} onSuccess={close} />}
    </DisclosureDialog>
  );
}

export function UpdateCurrentAccount({ account }: UpdateAccountProps) {
  return (
    <DisclosureDialog
      title="Edit Account"
      triggerButton={(open) => (
        <Button
          size="sm"
          variant="secondary"
          startIcon={mdiPencil}
          onClick={open}
        >
          <span>Edit</span>
        </Button>
      )}
    >
      {({ close }) => (
        <UpdateCurrentAccountForm account={account} onSuccess={close} />
      )}
    </DisclosureDialog>
  );
}
