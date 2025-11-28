import { mdiPencil } from "@mdi/js";

import { Button, DisclosureDialog } from "components/Elements";
import { UpdateClientForm } from "features/clients";

import { ClientOut } from "types";

type EditClientProps = {
  client: ClientOut;
};

export function EditClient({ client }: EditClientProps) {
  return (
    <DisclosureDialog
      title="Edit Telegram Account"
      triggerButton={(open) => (
        <Button
          size="sm"
          variant="secondary"
          startIcon={mdiPencil}
          className="flex-shrink-0"
          onClick={open}
        >
          <span>Edit</span>
        </Button>
      )}
    >
      {({ close }) => <UpdateClientForm client={client} onSuccess={close} />}
    </DisclosureDialog>
  );
}
