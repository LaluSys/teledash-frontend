import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom"; // see: https://github.com/remix-run/react-router/issues/8264#issuecomment-991271554

import { Button, PageLoadingSpinner, PageError } from "components/Elements";
import { Notifications } from "components/Notifications";
import { AuthLoader } from "lib/auth";
import { queryClient } from "lib/react-query";

const ErrorFallback = ({ error }: FallbackProps) => {
  // Handle in app errors that happen in the React tree
  // see: https://github.com/alan2207/bulletproof-react/blob/master/docs/error-handling.md#in-app-errors
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center"
      role="alert"
    >
      <div className="text-sm font-semibold uppercase tracking-wide text-red-500">
        {error.message}
      </div>
      <div className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
        Something went wrong.
      </div>
      <div className="mt-2 max-w-prose text-base text-gray-500">
        Refresh this page and try again. If the problem persists, contact the
        administrator.
      </div>
      {import.meta.env.NODE_ENV === "development" && (
        <div className="mt-4 max-h-96 max-w-4xl overflow-y-scroll whitespace-pre-wrap bg-gray-100 font-mono text-sm">
          {JSON.stringify(error, null, 2)}
        </div>
      )}
      <Button
        className="mt-6"
        onClick={() => window.location.assign(window.location.origin)}
      >
        Refresh
      </Button>
    </div>
  );
};

type AppProviderProps = {
  children: React.ReactNode;
};

export function AppProvider({ children }: AppProviderProps) {
  return (
    <React.Suspense fallback={<PageLoadingSpinner />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {import.meta.env.NODE_ENV !== "test" && <ReactQueryDevtools />}
            <Notifications />
            <AuthLoader
              renderLoading={PageLoadingSpinner}
              renderError={PageError}
            >
              <BrowserRouter>{children}</BrowserRouter>
            </AuthLoader>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  );
}
