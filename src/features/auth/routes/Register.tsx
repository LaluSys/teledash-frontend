import { mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { Layout, RegisterForm } from "features/auth";

export const Register = () => {
  const [isRegisteredSuccessfully, setIsRegisteredSuccessfully] =
    useState(false);
  return (
    <Layout title="Register your account">
      {!isRegisteredSuccessfully ? (
        <RegisterForm onSuccess={() => setIsRegisteredSuccessfully(true)} />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center gap-2 px-1 py-4 text-center">
            <Icon
              path={mdiCheckCircleOutline}
              size={2}
              className="text-green-500"
            />
            <p>
              Successfully registered. Please contact an administrator to have
              your account activated.
            </p>
          </div>
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
        </>
      )}
    </Layout>
  );
};
