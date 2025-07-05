import { Montserrat } from 'next/font/google';
import '../style/global.css';
import '../style/base.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { getUserFromCookie } from '@/utils/server/auth';
import { AuthProvider } from '../context/AuthContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
