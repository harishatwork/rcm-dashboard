import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts
    server: { entry: "server" },
  },
  vite: {
    server: {
      watch: {
        // Prevent Vite SSR from reloading when TanStack Router regenerates the route tree
        ignored: ["**/routeTree.gen.ts"],
      },
    },
  },
});
