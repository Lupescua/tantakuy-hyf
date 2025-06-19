export default function LoggedOutPage() {
    return (

      
    <main className="home">
      <header className="header">
      <h1>Velkommen!</h1>
      <p>Log ind eller tilmeld dig for at få adgang til din konto.</p>      
      </header>
      <section className="hero">
        <h2 className="hero-title">Konkurrencer</h2>
        <p className="hero-subtitle">
          Udforsk kreative konkurrencer og deltag i udfordringer, der belønner engagement, originalitet og indflydelse.
        </p>

        <div className="filters">
          <select><option>Kategori</option></select>
          <select><option>Popularitet</option></select>
          <select><option>Dato</option></select>
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
    );
  }
  