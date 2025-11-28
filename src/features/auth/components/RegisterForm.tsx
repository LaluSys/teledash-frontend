import { Link } from "react-router-dom";

import { Button } from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import { RegisterInput, registerInputSchema } from "features/auth";
import { useRegister } from "lib/auth";

type RegisterFormProps = {
  onSuccess: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegister({ onSuccess });

  return (
    <div>
      <Form<RegisterInput, typeof registerInputSchema>
        onSubmit={async (data) => {
          try {
            await registerMutation.mutateAsync(data);
          } catch (error) {
            // TODO: Display the error message.
            console.error(error);
          }
        }}
        schema={registerInputSchema}
        options={{
          // TODO: Evaluate what this exactly does. See https://react-hook-form.com/docs/useform#shouldUnregister
          shouldUnregister: true,
        }}
      >
        {({ register, formState }) => (
          <>
            <TextInputGroup
              id="first-name"
              label="First Name"
              autoComplete="given-name"
              registration={register("first_name")}
              error={formState.errors["first_name"]}
            />
            <TextInputGroup
              id="last-name"
              label="Last Name"
              autoComplete="family-name"
              registration={register("last_name")}
              error={formState.errors["last_name"]}
            />
            <TextInputGroup
              id="email"
              type="email"
              label="Email Address"
              autoComplete="email"
              registration={register("email")}
              error={formState.errors["email"]}
            />
            <TextInputGroup
              id="password"
              type="password"
              label="Password"
              autoComplete="new-password"
              registration={register("password")}
              error={formState.errors["password"]}
            />
            <div>
              <Button
                isLoading={registerMutation.isPending}
                type="submit"
                className="w-full"
              >
                Register
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to="../login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
