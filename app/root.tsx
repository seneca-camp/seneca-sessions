import type { LinksFunction } from 'react-router';
import '~/css/tailwind.css';
import 'remixicon/fonts/remixicon.css'

import { Links, Outlet, Scripts } from 'react-router';
import Footer from './components/Footer';

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "https://fonts.cdnfonts.com/css/cronospro" }
];

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
      <body className="overflow-y-scroll flex flex-col min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
