import Link from 'next/link';
import './footerLoggedOut.css';

export default function FooterLoggedOut() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">¿Do you have an account?</p>
        <div className="footer-auth-buttons">
          <Link href="/login" className="footer-btn login-btn">
            Log in
          </Link>
          <Link href="/signup" className="footer-btn signup-btn">
            Sign up
          </Link>
        </div>
      </div>
    </footer>
  );
}
