import { Outlet } from 'react-router';
import styles from '~/css/layout.module.css';
import { Logo } from "~/components/Logo";

export default function Layout() {
    return (
        <div className="p-4">
            <header className="flex justify-center items-center flex-col mt-4">
                <Logo />
                <nav><a href="/" className={styles.headline}>Sessions</a> | <a href="/rooms" className={styles.headline}>Raumplan</a></nav>
            </header>
            <Outlet />
        </div>
    )
}