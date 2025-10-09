import { Montserrat } from 'next/font/google';
import '../style/global.css';
import '../style/base.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import { getUserFromCookie } from '@/utils/server/auth';
import { AuthProvider } from '../context/AuthContext';
import { MobileSearchProvider } from '../context/MobileSearchContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: {
    default: 'Tantakuy - Konkurrencer og Fotoudfordringer',
    template: '%s | Tantakuy',
  },
  description:
    'Deltag i spændende fotokonkurrencer, stem på dine favoritter, og vind præmier. Tantakuy forbinder virksomheder med kreative deltagere.',
  keywords: [
    'konkurrencer',
    'fotokonkurrencer',
    'fotoudfordringer',
    'vind præmier',
    'kreativitet',
    'Danmark',
  ],
  authors: [{ name: 'Tantakuy' }],
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://tantakuy.com',
    siteName: 'Tantakuy',
    title: 'Tantakuy - Konkurrencer og Fotoudfordringer',
    description:
      'Deltag i spændende fotokonkurrencer, stem på dine favoritter, og vind præmier.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tantakuy.com'}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Tantakuy - Konkurrencer og Fotoudfordringer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tantakuy - Konkurrencer og Fotoudfordringer',
    description:
      'Deltag i spændende fotokonkurrencer, stem på dine favoritter, og vind præmier.',
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tantakuy.com'}/og-image.jpg`,
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="da" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <AuthProvider>
          <MobileSearchProvider>
            <Navbar />
            {children}
            <Footer />
          </MobileSearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
