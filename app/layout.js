import { Montserrat } from 'next/font/google';
import '../style/global.css';
import '../style/base.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavbarLoggedIn from './components/layouts/NavbarLoggedIn/NavbarLoggedIn';
import NavbarLoggedOut from './components/layouts/NavbarLoggedOut/NavbarLoggedOut';
import { getUserFromCookie } from '@/utils/server/auth';
import FooterLoggedIn from './components/layouts/FooterLoggedIn/FooterLoggedIn'
import FooterLoggedOut from './components/layouts/FooterLoggedOut/FooterLoggedOut'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default async function RootLayout({ children }) {
  const user = await getUserFromCookie();
  console.log(user, user.userName, user.id, user.email)
  const isLoggedIn = !!user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
      {isLoggedIn ? <NavbarLoggedIn user={user} /> : <NavbarLoggedOut />}
      {children}
      {isLoggedIn ? <FooterLoggedIn /> : <FooterLoggedOut />}
        </body>
    </html>
  );
}
