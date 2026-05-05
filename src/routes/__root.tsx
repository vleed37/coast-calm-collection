import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <head>
        <title>Page Not Found | [BRAND]</title>
        <meta name="robots" content="noindex, follow" />
      </head>
      <div className="max-w-xl text-center">
        <span className="smallcaps text-warmth">404</span>
        <h1 className="font-display text-4xl md:text-6xl font-light mt-6 leading-[1.05]">
          This path doesn't lead anywhere.
        </h1>
        <p className="mt-6 text-ink/80 text-lg">Try the collection instead.</p>
        <Link
          to="/properties"
          className="inline-block mt-10 bg-ocean text-cream px-10 py-4 uppercase tracking-[0.2em] text-sm hover:bg-ink transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          View the collection
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#F8F5EF" },
      { name: "format-detection", content: "telephone=no" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png" },
      { rel: "dns-prefetch", href: "https://images.unsplash.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ocean focus:text-cream focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <main id="main">{children}</main>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
