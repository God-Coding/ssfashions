import Link from 'next/link';
import styles from './Header.module.css';
import { auth } from '@/auth';
import { signIn, signOut } from '@/auth';

async function SignInButton() {
    return (
        <form action={async () => {
            'use server';
            await signIn('google');
        }}>
            <button type="submit" className={`btn ${styles.contactBtn}`}>
                Sign In
            </button>
        </form>
    );
}

async function SignOutButton() {
    return (
        <form action={async () => {
            'use server';
            await signOut();
        }}>
            <button type="submit" className={styles.link} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Sign Out
            </button>
        </form>
    );
}

export default async function Header() {
    const session = await auth();

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    SS Fashions
                </Link>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>Home</Link>
                    {session?.user && (
                        <Link href="/wishlist" className={styles.link}>❤️ Wishlist</Link>
                    )}
                    {session?.user && (
                        <Link href="/orders" className={styles.link}>📦 My Orders</Link>
                    )}
                    <a href="https://wa.me/918179572442" target="_blank" rel="noopener noreferrer" className={`btn ${styles.contactBtn}`}>
                        Contact Us
                    </a>
                    {session?.user ? (
                        <>
                            <span className={styles.link}>Hi, {session.user.name?.split(' ')[0]}</span>
                            <SignOutButton />
                        </>
                    ) : (
                        <SignInButton />
                    )}
                </nav>
            </div>
        </header>
    );
}
