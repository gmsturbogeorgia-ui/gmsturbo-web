import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createTanStackRouter({
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

// TanStack Start's generated client entry imports a named `createRouter`
// from this file by convention — keep both names available.
export const createRouter = getRouter;

export default getRouter;
