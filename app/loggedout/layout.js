import NavbarLoggedOut from '../components/NavbarLoggedOut/NavbarLoggedOut';
import FooterLoggedOut from '../components/FooterLoggedOut/FooterLoggedOut';

import '../components/NavbarLoggedOut/navbarLoggedOut.css';
import '../components/FooterLoggedOut/footerLoggedOut.css';

export default function LoggedOutLayout({ children }) {
  return (
    <>
      <NavbarLoggedOut />
      <div className="container">
        <main>{children}</main>
        <FooterLoggedOut />
      </div>
    </>
  );
}
