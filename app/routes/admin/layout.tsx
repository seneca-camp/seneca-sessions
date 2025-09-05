import { Link, Outlet } from "react-router";
import { Logo } from "~/components/Logo";
import "~/css/layout.module.css";

export default function AdminLayout() {
    return (
        <div>
            <nav className="flex flex-row gap-4 bg-white p-4 rounded-lg shadow-md mb-4 items-center">
                <Logo width="30px" />
                <Link to="/">Home</Link>
                <Link to="/rooms">Rooms</Link>
                <Link to="/admin">Schedules</Link>
            </nav>
            <Outlet />
        </div>
    )
}