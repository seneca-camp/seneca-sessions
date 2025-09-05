import { Outlet } from 'react-router';
import styles from '~/css/layout.module.css';
import { Logo } from "~/components/Logo";

export default function Layout() {
    return (
        <>
            <header style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <Logo />
                <nav><a href="/" className={styles.headline}>Sessions</a> | <a href="/rooms" className={styles.headline}>Raumplan</a></nav>
            </header>
            <Outlet />
        </>
    )
}