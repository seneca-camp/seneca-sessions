import type { LinksFunction } from "@remix-run/node";
import logo from "~/gfx/logo.png"
import stylesheet from "~/tailwind.css"

import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function Logo() {
  return <img src={logo} width="200px" alt="Seneca Logo" />;
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Links />
        <title>Seneca Sessions</title>
      </head>
      <body className="p-4">
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
          <Logo />
          <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-black">Seneca-Sessions #seneca23</h1>
        </div>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
