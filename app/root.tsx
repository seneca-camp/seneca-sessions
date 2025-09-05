import type { LinksFunction } from 'react-router';
import '~/css/tailwind.css';
import 'remixicon/fonts/remixicon.css'

import { Links, Outlet, Scripts } from 'react-router';

import styles from '~/css/root.module.css';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://fonts.cdnfonts.com/css/cronospro" }
];

export default function App() {
  const year = new Date().getFullYear();
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
        <Outlet />
        <p className="text-white text-center">#seneca{year} <a href="https://seneca.camp/impressum/">Impressum</a></p>
        <Scripts />
      </body>
    </html>
  );
}
