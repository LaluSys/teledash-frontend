import * as React from "react";

import { Button, DisclosureDialog } from "components/Elements";

export type ConfirmationDialogProps = {
  triggerButton: (open: () => void) => React.ReactElement;
  confirmButton: React.ReactElement;
  title: string;
  body?: string;
  cancelButtonText?: string;
};

export const ConfirmationDialog = ({
  triggerButton,
  confirmButton,
  title,
  body = "",
  cancelButtonText = "Cancel",
}: ConfirmationDialogProps) => {
  return (
    <DisclosureDialog title={title} triggerButton={triggerButton}>
      {({ close }) => (
        <div className="space-y-4">
          {body && <p className="text-sm text-gray-500">{body}</p>}
          {confirmButton}
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={close}
            data-autofocus
          >
            {cancelButtonText}
          </Button>
        </div>
      )}
    </DisclosureDialog>
  );
};
