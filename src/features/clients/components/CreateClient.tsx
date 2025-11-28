import { Button, DisclosureDialog } from "components/Elements";
import { CreateClientForm } from "features/clients";

export function CreateClient() {
  return (
    <DisclosureDialog
      triggerButton={(open) => (
        <Button size="sm" variant="secondary" onClick={open}>
          Add Telegram Account
        </Button>
      )}
      title={"Add Telegram Account"}
    >
      {({ close }) => <CreateClientForm onSuccess={close} />}
    </DisclosureDialog>
  );
}
