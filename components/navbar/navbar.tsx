import Link from 'next/link';
import styles from './navbar.module.css';

export default function Navbar() {
    return (
        <nav>
            <ul className={styles.navWrapper}>
                <li>
                    <Link href={"/"}>Home</Link>
                </li>
                <li>
                    <Link href={"/search"}>Semantic Search</Link>
                </li>
            </ul>
        </nav>
    );
}