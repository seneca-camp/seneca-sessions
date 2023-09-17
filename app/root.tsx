import type { LinksFunction } from "@remix-run/node";
import logo from "~/gfx/logo.png"

import {
  Form,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";


export function Logo() {
  return <img src={logo} width="50px" alt="Seneca Logo" />;
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.css" />
        <title>Seneca Sessions</title>
      </head>
      <body>
        <h1><Logo/>Sessions #seneca23</h1>
        <Outlet />
        <LiveReload />
      </body>
    </html>
  );
}
