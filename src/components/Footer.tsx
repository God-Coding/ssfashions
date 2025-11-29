import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.content}>
                    <div className={styles.brand}>
                        <h3>SS Fashions</h3>
                        <p>Premium Ethnic Wear</p>
                    </div>
                    <div className={styles.contact}>
                        <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className={styles.whatsapp}>
                            <span className={styles.icon}>📱</span> Chat on WhatsApp
                        </a>
                    </div>
                </div>
                <div className={styles.copyright}>
                    &copy; {new Date().getFullYear()} SS Fashions. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
