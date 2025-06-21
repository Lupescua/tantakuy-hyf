import Link from 'next/link';

export default function NavbarLoggedOut() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-top fade-in">
          <h1 className="site-title">Tantakuy</h1>
          <div className="auth-buttons">
            <Link href="/login" className="nav-btn">
              Log in
            </Link>
            <Link href="/signup" className="nav-btn primary">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
