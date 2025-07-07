import { getUserFromCookie } from '@/utils/server/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUserFromCookie();
  if (user?.role === 'company') {
    redirect('/company/profile');
  }
  return (
    <>
      <main className="home">
        <header className="header">
          <h1 className="logo">HOME</h1>
        </header>

        <section className="hero">
          <h2 className="hero-title">Konkurrencer</h2>
          <p className="hero-subtitle">
            Udforsk kreative konkurrencer og deltag i udfordringer, der belønner
            engagement, originalitet og indflydelse.
          </p>

          <div className="filters">
            <select>
              <option>Kategori</option>
            </select>
            <select>
              <option>Popularitet</option>
            </select>
            <select>
              <option>Dato</option>
            </select>
          </div>
        </section>

        <section className="competition-preview">
          <h3>Konkurrencetitel</h3>
          <div className="image-grid">
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
            <div className="card"></div>
          </div>
        </section>
      </main>
    </>
  );
}
