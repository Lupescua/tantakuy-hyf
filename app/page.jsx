import Link from 'next/link';


export default function IndexPage() {
  return (
    <>
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          textAlign: 'center',
          gap: '2rem'
        }}
      >
        <Link href="/loggedin" style={{ fontSize: '1.5rem', color: '#4e36e2', textDecoration: 'underline', cursor: 'pointer' }}>
          Check LOGGED IN NAVBAR & FOOTER (Desktop & Mobile)
        </Link>

        <Link href="/loggedout" style={{ fontSize: '1.5rem', color: '#00c6ae', textDecoration: 'underline', cursor: 'pointer' }}>
          Check LOGGED OUT NAVBAR & FOOTER (Desktop & Mobile)
        </Link>
      </main>
    </>
  );
}