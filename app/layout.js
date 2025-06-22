import { Montserrat } from 'next/font/google';
import '../style/base.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Tantakuy',
  description: 'Gamified competition platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        <div className="container">
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
