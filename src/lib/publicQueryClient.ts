import { QueryClient } from "@tanstack/react-query";

// Shared across the public site's data-backed sections (Companies,
// Testimonials, Services, ...). Longer staleTime than the admin panel's
// client — visitors don't need near-real-time freshness, and it avoids
// re-fetching on every section mount during a single visit.
export const publicQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60_000,
    },
  },
});
