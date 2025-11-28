import { Link } from "react-router-dom";

import { Button } from "components/Elements";
import { Form, TextInputGroup } from "components/Form";
import { LoginInput, loginInputSchema } from "features/auth";
import { useLogin } from "lib/auth";

type LoginFormProps = {
  onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const login = useLogin({ onSuccess });

  return (
    <div>
      <Form<LoginInput, typeof loginInputSchema>
        onSubmit={async (data) => {
          try {
            await login.mutateAsync(data);
          } catch (error) {
            // TODO: Display the error message.
            console.error(error);
          }
        }}
        schema={loginInputSchema}
      >
        {({ register, formState }) => (
          <>
            <TextInputGroup
              id="email"
              type="email"
              label="Email Address"
              autoComplete="username"
              registration={register("username")}
              error={formState.errors["username"]}
            />
            <TextInputGroup
              id="password"
              type="password"
              label="Password"
              autoComplete="current-password"
              registration={register("password")}
              error={formState.errors["password"]}
            />
            <div>
              <Button
                isLoading={login.isPending}
                type="submit"
                className="w-full"
              >
                Log in
              </Button>
            </div>
          </>
        )}
      </Form>
      <div className="mt-2 flex items-center justify-end">
        <div className="text-sm">
          <Link
            to="../register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
