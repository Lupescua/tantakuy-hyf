import { Montserrat } from 'next/font/google';
import '../style/global.css';
import '../style/base.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavbarLoggedIn from './components/layouts/NavbarLoggedIn/NavbarLoggedIn';
import NavbarLoggedOut from './components/layouts/NavbarLoggedOut/NavbarLoggedOut';
import { getUserFromCookie } from '@/utils/server/auth';
import FooterLoggedIn from './components/layouts/FooterLoggedIn/FooterLoggedIn';
import FooterLoggedOut from './components/layouts/FooterLoggedOut/FooterLoggedOut';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default async function RootLayout({ children }) {
  const user = await getUserFromCookie();
<<<<<<< HEAD
=======
  console.log(user?.userName, user?.id, user?.email); // ✅ Seguro
>>>>>>> 79f43f25a61655a72462c5b4f08143c102447882
  const isLoggedIn = !!user;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
<<<<<<< HEAD
      {isLoggedIn ? <NavbarLoggedIn /> : <NavbarLoggedOut />}
      {children}
      {isLoggedIn ? <FooterLoggedIn /> : <FooterLoggedOut />}
        </body>
=======
        {isLoggedIn ? <NavbarLoggedIn user={user} /> : <NavbarLoggedOut />}
        {children}
        {isLoggedIn ? <FooterLoggedIn /> : <FooterLoggedOut />}
      </body>
>>>>>>> 79f43f25a61655a72462c5b4f08143c102447882
    </html>
  );
}
