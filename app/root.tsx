import type { LinksFunction } from "@remix-run/node";
import logo from '~/gfx/logo.png';
import stylesheet from '~/tailwind.css';

import { cssBundleHref } from '@remix-run/css-bundle';
import { Links, LiveReload, Outlet, Scripts } from '@remix-run/react';

import style from './root.module.css';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  { rel: "stylesheet", href: cssBundleHref },
  { rel: "stylesheet", href: "https://fonts.cdnfonts.com/css/cronospro" }
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
        <Scripts />
        <title>Seneca Sessions</title>
      </head>
      <body className="p-4">
        <header style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <Logo />
          <h1 className={style.headline}>Sessions</h1>
        </header>
        <Outlet />
        <p className="text-white text-center"><a href="https://twitter.com/search?q=%23seneca2023">#seneca2023</a></p>
        <LiveReload />
      </body>
    </html>
  );
}
