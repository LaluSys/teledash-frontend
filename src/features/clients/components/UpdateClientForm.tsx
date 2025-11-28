import { Button, DialogCloseButton } from "components/Elements";
import { Checkbox, Form, TextInputGroup } from "components/Form";
import {
  UpdateClientInput,
  updateClientInputSchema,
  useUpdateClient,
} from "features/clients";

import { useNotificationStore } from "stores/notifications";
import { ClientOut } from "types";

type UpdateClientFormProps = {
  client: ClientOut;
  onSuccess: () => void;
};

export function UpdateClientForm({ client, onSuccess }: UpdateClientFormProps) {
  const { addNotification } = useNotificationStore();

  const updateClientMutation = useUpdateClient({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Client updated.",
        });
      },
    },
  });

  return (
    <Form<UpdateClientInput, typeof updateClientInputSchema>
      onSubmit={async (data) => {
        try {
          await updateClientMutation.mutateAsync({ id: client.id, data });
          // onSuccess(); // Is already called by providing onSuccess in mutationConfig.
        } catch (error) {
          // TODO: Display the error message.
          console.error(error);
        }
      }}
      options={{
        defaultValues: {
          title: client.title,
          is_active: client.is_active,
        },
      }}
      schema={updateClientInputSchema}
      className="w-full"
    >
      {({ register, formState }) => (
        <>
          <TextInputGroup
            id="title"
            type="text"
            label="Title"
            placeholder={client.title}
            description="Arbitrary title"
            registration={register("title")}
            error={formState.errors["title"]}
          />
          <TextInputGroup
            id="phone_number"
            type="tel"
            label="Phone Number"
            placeholder={
              client.phone_number.slice(0, 3) +
              "..." +
              client.phone_number.slice(-3)
            }
            registration={{ disabled: true }}
          />
          <TextInputGroup
            id="api_id"
            type="number"
            label="API ID"
            placeholder={
              client.api_id.toString().slice(0, 3) +
              "..." +
              client.api_id.toString().slice(-3)
            }
            registration={{ disabled: true }}
          />
          <TextInputGroup
            id="api_hash"
            type="text"
            label="API Hash"
            placeholder={
              client.api_hash.slice(0, 3) + "..." + client.api_hash.slice(-3)
            }
            registration={{ disabled: true }}
          />
          <Checkbox
            id="is-active-checkbox"
            label="Active?"
            hint="Only active accounts will be scraped."
            registration={register("is_active")}
          />
          <Button
            isLoading={updateClientMutation.isPending}
            type="submit"
            className="w-full"
          >
            Update
          </Button>
          <DialogCloseButton as={Button} variant="secondary" className="w-full">
            Cancel
          </DialogCloseButton>
        </>
      )}
    </Form>
  );
}
