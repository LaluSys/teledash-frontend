import { Button, DialogCloseButton } from "components/Elements";
import { Checkbox, Form, TextInputGroup } from "components/Form";
import {
  PatchAccountInput,
  patchAccountInputSchema,
  usePatchAccount,
  usePatchCurrentAccount,
} from "features/accounts";

import { useNotificationStore } from "stores/notifications";
import { Account } from "types";

type UpdateAccountFormProps = {
  account: Account;
  onSuccess: () => void;
};

export function UpdateAccountForm({
  account,
  onSuccess,
}: UpdateAccountFormProps) {
  const { addNotification } = useNotificationStore();

  const patchAccountMutation = usePatchAccount({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Account updated.",
        });
      },
    },
  });

  return (
    <Form<PatchAccountInput, typeof patchAccountInputSchema>
      onSubmit={async (data) => {
        try {
          await patchAccountMutation.mutateAsync({ id: account.id, data });
          // onSuccess(); // Is already called by providing onSuccess in mutationConfig.
        } catch (error) {
          // TODO: Display the error message.
          console.error(error);
        }
      }}
      options={{
        defaultValues: {
          first_name: account.first_name,
          last_name: account.last_name,
          email: account.email,
          is_active: account.is_active,
          is_verified: account.is_verified,
          is_superuser: account.is_superuser,
        },
      }}
      schema={patchAccountInputSchema}
      className="w-full"
    >
      {({ register, formState }) => (
        <>
          <TextInputGroup
            id="first_name"
            type="text"
            label="First name"
            description="Arbitrary name"
            placeholder={account.first_name}
            registration={register("first_name")}
            error={formState.errors["first_name"]}
          />
          <TextInputGroup
            id="last_name"
            type="text"
            label="Last name"
            description="Arbitrary name"
            placeholder={account.last_name}
            registration={register("last_name")}
            error={formState.errors["last_name"]}
          />
          <TextInputGroup
            id="email"
            type="text"
            label="E-Mail"
            description="E-Mail address used for logging in"
            placeholder={account.email}
            registration={register("email")}
            error={formState.errors["email"]}
          />
          <TextInputGroup
            id="password"
            type="password"
            label="Password"
            description="Password used for logging in"
            registration={register("password")}
            error={formState.errors["password"]}
          />
          <TextInputGroup
            id="confirm-password"
            type="password"
            label="Confirm password"
            description="Password used for logging in"
            registration={register("confirm_password")}
            error={formState.errors["confirm_password"]}
          />
          <Checkbox
            id="is-active-checkbox"
            label="Active?"
            hint="Only active accounts are able to log in."
            registration={register("is_active")}
          />
          <Checkbox
            id="is-verified-checkbox"
            label="Verified?"
            hint="Only verified accounts are able to log in."
            registration={register("is_verified")}
          />
          <Checkbox
            id="is-admin-checkbox"
            label="Admin?"
            hint="Admins are able to manage accounts."
            registration={register("is_superuser")}
          />
          <Button
            isLoading={patchAccountMutation.isPending}
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

export function UpdateCurrentAccountForm({
  account,
  onSuccess,
}: UpdateAccountFormProps) {
  const { addNotification } = useNotificationStore();

  const patchCurrentAccountMutation = usePatchCurrentAccount({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Account updated.",
        });
      },
    },
  });

  return (
    <Form<PatchAccountInput, typeof patchAccountInputSchema>
      onSubmit={async (data) => {
        try {
          await patchCurrentAccountMutation.mutateAsync({ data });
          // onSuccess(); // Is already called by providing onSuccess in mutationConfig.
        } catch (error) {
          // TODO: Display the error message.
          console.error(error);
        }
      }}
      options={{
        defaultValues: {
          first_name: account.first_name,
          last_name: account.last_name,
          email: account.email,
          is_active: account.is_active,
          is_verified: account.is_verified,
          is_superuser: account.is_superuser,
        },
      }}
      schema={patchAccountInputSchema}
      className="w-full"
    >
      {({ register, formState }) => (
        <>
          <TextInputGroup
            id="first_name"
            type="text"
            label="First name"
            description="Arbitrary name"
            placeholder={account.first_name}
            registration={register("first_name")}
            error={formState.errors["first_name"]}
          />
          <TextInputGroup
            id="last_name"
            type="text"
            label="Last name"
            description="Arbitrary name"
            placeholder={account.last_name}
            registration={register("last_name")}
            error={formState.errors["last_name"]}
          />
          <TextInputGroup
            id="email"
            type="text"
            label="E-Mail"
            description="E-Mail address used for logging in. When changed, your account will need to be re-verified by an administrator."
            placeholder={account.email}
            registration={register("email")}
            error={formState.errors["email"]}
          />
          <TextInputGroup
            id="password"
            type="password"
            label="Password"
            description="Password used for logging in"
            registration={register("password")}
            error={formState.errors["password"]}
          />
          <TextInputGroup
            id="confirm-password"
            type="password"
            label="Confirm password"
            description="Password used for logging in"
            registration={register("confirm_password")}
            error={formState.errors["confirm_password"]}
          />
          <Button
            isLoading={patchCurrentAccountMutation.isPending}
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
