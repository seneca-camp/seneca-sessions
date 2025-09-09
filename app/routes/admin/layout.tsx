import { Link, Outlet } from "react-router";
import { Logo } from "~/components/Logo";
import "~/css/layout.module.css";

export default function AdminLayout() {
    return (
        <div className="h-full pb-4">
            <nav className="flex flex-row gap-4 bg-black p-4 rounded-lg text-white shadow-md mb-4 items-center">
                <Logo width="30px" />
                <NavLink to="/">
                    <i className="ri-home-line"></i> Home
                </NavLink>
                <NavLink to="/rooms">
                    <i className="ri-presentation-line"></i> Rooms
                </NavLink>
                <NavLink to="/admin">
                    <i className="ri-calendar-line"></i> Schedules
                </NavLink>
            </nav>
            <Outlet />
        </div>
    )
}

function NavLink({ to, children }: { to: string, children: React.ReactNode }) {
    return (
        <Link className="hover:bg-gray-90 rounded-lg px-2 py-2" to={to}>{children}</Link>
    )
}