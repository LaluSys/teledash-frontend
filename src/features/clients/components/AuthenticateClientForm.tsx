import { Button, DialogCloseButton } from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import { useState } from "react";

import {
  useVerifyPassword,
  useVerifyPhoneCode,
  VerifyPasswordInput,
  verifyPasswordInputSchema,
  VerifyPhoneCodeInput,
  verifyPhoneCodeInputSchema,
} from "features/clients";
import { useNotificationStore } from "stores/notifications";
import { PostCreateClientResponse } from "types";

type AuthenticateClientFormProps = {
  client: PostCreateClientResponse;
  onSuccess: () => void;
};

// TODO: Evaluate the auth type and be more specific about where the phone code is supposed to be received.
export function AuthenticateClientForm({
  client,
  onSuccess,
}: AuthenticateClientFormProps) {
  const { addNotification } = useNotificationStore();
  const [needsPassword, setNeedsPassword] = useState(false);

  const verifyPhoneCodeMutation = useVerifyPhoneCode({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Client successfully authenticated, session opened.",
        });
      },
      onError: (error: any) => {
        // Check if 2FA is required (HTTP 403)
        if (error?.response?.status === 403) {
          setNeedsPassword(true);
          addNotification({
            type: "info",
            title: "Two-factor authentication required",
            message:
              "Please enter your 2FA/cloud password to complete authentication.",
          });
        }
      },
    },
  });

  const verifyPasswordMutation = useVerifyPassword({
    mutationConfig: {
      onSuccess: () => {
        onSuccess();
        addNotification({
          type: "success",
          title: "Client successfully authenticated, session opened.",
        });
      },
    },
  });

  return (
    <>
      <Form<VerifyPhoneCodeInput, typeof verifyPhoneCodeInputSchema>
        onSubmit={async (data) => {
          try {
            await verifyPhoneCodeMutation.mutateAsync({
              id: client.id,
              data,
            });
          } catch (error) {
            // TODO: Display the error message.
            console.error(error);
          }
        }}
        options={{
          // We don't reveal phone_code_hash to the user but this way it is
          // validated and conveniently added to the data sent to the API.
          defaultValues: {
            phone_code_hash: client.auth.phone_code_hash,
          },
          resetOptions: {
            // Inside of the Form component, reset is called when submit is
            // successful. Here we want to keep the phone_code for it to be
            // displayed in case a password is needed.
            keepValues: true,
          },
          disabled: needsPassword,
        }}
        schema={verifyPhoneCodeInputSchema}
        className="w-full"
      >
        {({ register, formState, setValue }) => {
          return (
            <>
              <TextInputGroup
                id="phone-code"
                type="text"
                label="Phone Code"
                placeholder="Please enter the phone code that was sent to you"
                description="The phone code is sent to a previously authenticated Telegram client (probably on your phone)."
                autoComplete="off"
                registration={register("phone_code", {
                  onChange: (e) => {
                    setValue("phone_code", e.target.value.replace(/\D/g, ""));
                  },
                })}
                error={formState.errors["phone_code"]}
              />
              {!needsPassword && (
                <>
                  <Button
                    // disabled={!formState.isValid}
                    isLoading={verifyPhoneCodeMutation.isPending}
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
            </>
          );
        }}
      </Form>
      {needsPassword && (
        <Form<VerifyPasswordInput, typeof verifyPasswordInputSchema>
          onSubmit={async (data) => {
            try {
              await verifyPasswordMutation.mutateAsync({
                id: client.id,
                data,
              });
            } catch (error) {
              // TODO: Display the error message.
              console.error(error);
            }
          }}
          schema={verifyPasswordInputSchema}
          className="w-full"
        >
          {({ register, formState }) => (
            <>
              <TextInputGroup
                id="password"
                type="password"
                label="2FA/Cloud Password"
                placeholder="Enter your Telegram 2FA/cloud password"
                description="Your account has two-factor authentication enabled."
                registration={register("password")}
                error={formState.errors["password"]}
              />
              <Button
                disabled={!formState.isValid}
                isLoading={verifyPasswordMutation.isPending}
                type="submit"
                className="w-full"
              >
                Verify Password
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
      )}
    </>
  );
}
