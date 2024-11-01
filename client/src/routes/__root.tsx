import React from "react";
import {
  createRootRouteWithContext,
  Outlet,
  useMatches,
} from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { LocaleProvider } from "@/providers/locale-provider";
import { ThemeProvider } from "@/providers/theme-provider";

import { ErrorComponent } from "@/components/route/error-boundary";
import { NotFoundComponent } from "@/components/route/not-found";

interface RouterContext {
  queryClient: QueryClient;
}

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : React.lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      );

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ({ error }) => <ErrorComponent error={error} />,
});

const TITLE = "Twittor Academy";

function Meta({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const meta = matches.at(-1)?.meta?.find((meta) => meta.title);

  React.useEffect(() => {
    document.title = [meta?.title, TITLE].filter(Boolean).join(" · ");
  }, [meta]);

  return children;
}

function RootComponent() {
  return (
    <Meta>
      <ThemeProvider defaultTheme="system">
        <LocaleProvider>
          <Outlet />
        </LocaleProvider>
      </ThemeProvider>
      <ReactQueryDevtools />
      <TanStackRouterDevtools position="bottom-left" />
    </Meta>
  );
}
