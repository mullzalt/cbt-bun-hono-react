import React, { Suspense } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { NotFoundComponent } from "@/components/route/not-found";

import "./index.css";
import "./i18n";

import ReactDOM from "react-dom/client";

import { useSession } from "./hooks/use-session";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

// Set up a Router instance
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  context: {
    queryClient,
    session: undefined!,
  },
  defaultNotFoundComponent: NotFoundComponent,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const session = useSession();

  return (
    <Suspense>
      <RouterProvider router={router} context={{ session }} />
    </Suspense>
  );
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
}
