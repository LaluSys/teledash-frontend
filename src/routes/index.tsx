import { RouteObject, useRoutes } from "react-router-dom";

import { useUser } from "lib/auth";

import { protectedRoutes } from "routes/protected";
import { publicRoutes } from "routes/public";

export const AppRoutes = () => {
  const user = useUser();

  const routes: RouteObject[] = user.data ? protectedRoutes : publicRoutes;

  const element = useRoutes(routes);

  return <>{element}</>;
};
