import { UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import checker from "vite-plugin-checker";

export default {
  plugins: [react(), viteTsconfigPaths(), checker({ typescript: true })],
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    port: 3000,
  },
} satisfies UserConfig;
