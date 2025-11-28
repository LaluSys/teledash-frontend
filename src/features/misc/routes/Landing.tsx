import { mdiHome } from "@mdi/js";
import { useNavigate } from "react-router-dom";

import { Button } from "components/Elements";
import { Head } from "components/Head";
import { useUser } from "lib/auth";

import { APP_NAME } from "config";

export const Landing = () => {
  const navigate = useNavigate();
  const user = useUser();

  const handleStart = () => {
    if (user.data) {
      navigate("/app");
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <>
      <Head description="Welcome " />
      <div className="flex h-[100vh] items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {APP_NAME}
          </h2>
          <div className="mt-8 flex">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={handleStart} startIcon={mdiHome}>
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
