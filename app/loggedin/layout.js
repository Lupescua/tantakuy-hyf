import { Montserrat } from 'next/font/google';

import NavbarLoggedIn from '../components/NavbarLoggedIn/NavbarLoggedIn';
import FooterLoggedIn from '../components/FooterLoggedIn/FooterLoggedIn';

import '../components/NavbarLoggedIn/navbarLoggedIn.css';
import '../components/FooterLoggedIn/footerLoggedIn.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default function LoggedInLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <div className="container">
          <NavbarLoggedIn />
          <main>{children}</main>
          <FooterLoggedIn />
        </div>
      </body>
    </html>
  );
}
