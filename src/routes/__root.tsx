import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-7xl font-display font-bold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Even the most efficient routes get lost sometimes.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-md gradient-bg px-5 py-2.5 text-sm font-semibold text-primary-foreground glow"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-10">
        <h1 className="text-xl font-semibold">Something went off the rails</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md gradient-bg px-4 py-2 text-sm font-medium text-primary-foreground"
          >Try again</button>
          <a href="/" className="rounded-md border px-4 py-2 text-sm font-medium">Home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EcoTrack AI — Measure Today. Save Tomorrow." },
      { name: "description", content: "AI-powered sustainability platform to track, analyze, and reduce your carbon footprint." },
      { property: "og:title", content: "EcoTrack AI — Measure Today. Save Tomorrow." },
      { property: "og:description", content: "AI-powered sustainability platform to track, analyze, and reduce your carbon footprint." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#00C853" },
      { name: "twitter:title", content: "EcoTrack AI — Measure Today. Save Tomorrow." },
      { name: "twitter:description", content: "AI-powered sustainability platform to track, analyze, and reduce your carbon footprint." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/oWtPtU9ThYaHiHDcPCsUpwyQcnE3/social-images/social-1782043522196-b5096c88-cc91-43b9-bb3a-340c48bda571.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/oWtPtU9ThYaHiHDcPCsUpwyQcnE3/social-images/social-1782043522196-b5096c88-cc91-43b9-bb3a-340c48bda571.webp" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
