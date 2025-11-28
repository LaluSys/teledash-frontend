import { Navigate } from "react-router-dom";

import { Landing } from "features/misc";
import { lazyImport } from "utils/lazyImport";

const { AuthRoutes } = lazyImport(() => import("features/auth"), "AuthRoutes");

export const publicRoutes = [
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/auth/*",
    element: <AuthRoutes />,
  },
  { path: "*", element: <Navigate to="." /> },
];
