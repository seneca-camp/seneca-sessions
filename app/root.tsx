import type { LinksFunction } from 'react-router';
import logo from './assets/logo.png';
import '~/css/tailwind.css';

import { Links, Outlet, Scripts } from 'react-router';

import styles from '~/css/root.module.css';

export const links: LinksFunction = () => [
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
          <nav><a href="/" className={styles.headline}>Sessions</a> | <a href="/rooms" className={styles.headline}>Raumplan</a></nav>
        </header>
        <Outlet />
        <p className="text-white text-center">#seneca2024 <a href="https://seneca.camp/impressum/">Impressum</a></p>
        {/* <LiveReload /> */}
      </body>
    </html>
  );
}
