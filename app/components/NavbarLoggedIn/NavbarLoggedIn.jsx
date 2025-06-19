import Link from 'next/link';

export default function NavbarLoggedIn() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top fade-in">
          <Link href="/" className="site-title">
            Tantakuy
          </Link>
          <div className="auth-buttons">
            <Link href="/" className="nav-btn primary">
              Home
            </Link>
            <Link href="/profile" className="nav-btn">
              My Profile
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
