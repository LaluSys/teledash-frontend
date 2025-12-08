import { mdiPlusThick } from "@mdi/js";
import { Button, Dialog, DialogCloseButton } from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import {
  AuthenticateClientForm,
  CreateClientInput,
  createClientInputSchema,
  useCreateClient,
} from "features/clients";

import { useDisclosure } from "hooks/useDisclosure";
import { useNotificationStore } from "stores/notifications";

type CreateClientFormProps = {
  onSuccess: () => void;
};

export function CreateClientForm({ onSuccess }: CreateClientFormProps) {
  const { addNotification } = useNotificationStore();
  const { open, close, isOpen } = useDisclosure();

  const createClientMutation = useCreateClient({
    mutationConfig: {
      onSuccess: () => {
        open();
        addNotification({
          type: "success",
          title: "Client created.",
        });
      },
    },
  });

  return (
    <>
      <Form<CreateClientInput, typeof createClientInputSchema>
        onSubmit={async (data) => {
          try {
            await createClientMutation.mutateAsync({ data });
            // onSuccess(); // Is already called by providing onSuccess in mutationConfig.
          } catch (error) {
            // TODO: Display the error message.
            console.error(error);
          }
        }}
        schema={createClientInputSchema}
        className="w-full"
      >
        {({ register, formState, setValue }) => (
          <>
            <TextInputGroup
              id="title"
              type="text"
              label="Title"
              placeholder="Please enter a title"
              description="An arbitrary title to identify this account."
              registration={register("title")}
              error={formState.errors["title"]}
            />
            <TextInputGroup
              id="phone_number"
              type="tel"
              label="Phone Number"
              startIcon={mdiPlusThick}
              placeholder="Please enter a phone number"
              description="The phone number (including country code) of the Telegram account to be authenticated."
              registration={register("phone_number", {
                onChange: (e) => {
                  setValue("phone_number", e.target.value.replace(/\D/g, ""));
                },
              })}
              error={formState.errors["phone_number"]}
            />
            <TextInputGroup
              id="api_id"
              type="text"
              label="API ID"
              placeholder="Please enter an API ID"
              description="The API ID obtained from https://my.telegram.org/auth."
              // TODO: Is this really the most convenient way to disallow non-digit characters?
              registration={register("api_id", {
                onChange: (e) => {
                  setValue("api_id", e.target.value.replace(/\D/g, ""));
                },
              })}
              error={formState.errors["api_id"]}
            />
            <TextInputGroup
              id="api_hash"
              type="text"
              label="API Hash"
              placeholder="Please enter an API Hash"
              description="The API Hash obtained from https://my.telegram.org/auth."
              registration={register("api_hash", {
                onChange: (e) => {
                  setValue(
                    "api_hash",
                    e.target.value.replace(/[^a-zA-Z0-9]/g, ""),
                  );
                },
              })}
              error={formState.errors["api_hash"]}
            />
            <Button
              disabled={!formState.isValid}
              isLoading={createClientMutation.isPending}
              type="submit"
              className="w-full"
            >
              Verify
            </Button>
            <DialogCloseButton
              as={Button}
              variant="secondary"
              className="w-full"
            >
              Cancel
            </DialogCloseButton>
          </>
        )}
      </Form>
      {/* TODO: Use DisclosureDialog? */}
      {createClientMutation.isSuccess && (
        <Dialog title="Verify account" isOpen={isOpen} onClose={close}>
          <AuthenticateClientForm
            client={createClientMutation.data}
            onSuccess={onSuccess}
          />
        </Dialog>
      )}
    </>
  );
}
