import { Link, Outlet } from 'react-router';
import { Logo } from "~/components/Logo";

export default function Layout() {
    return (
        <div className="p-4">
            <header className="flex justify-center items-center flex-col mt-4">
                <Logo />
                <nav className="flex gap-4 mt-4">
                    <NavLink to="/" name="Sessions" />
                    <NavLink to="/rooms" name="Raumplan" />
                </nav>
            </header>
            <Outlet />
        </div>
    )
}

function NavLink({ to, name }: { to: string, name: string }) {
    return (
        <Link className="text-3xl text-brightpetrole font-cronospro font-bold" to={to}>{name}</Link>
    )
}