export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    // Fetch entry data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/entries/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Bidrag ikke fundet',
        description: 'Dette bidrag kunne ikke findes.',
      };
    }

    const data = await res.json();
    const entry = data.entry || data;

    const participantName =
      entry.participant?.userName || 'En Tantakuy deltager';
    const caption = entry.caption || 'Se dette fantastiske bidrag';

    return {
      title: `${participantName}s bidrag`,
      description: caption,
      openGraph: {
        title: `${participantName}s bidrag | Tantakuy`,
        description: caption,
        images: entry.imageUrl
          ? [
              {
                url: entry.imageUrl,
                width: 1200,
                height: 630,
                alt: caption,
              },
            ]
          : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${participantName}s bidrag`,
        description: caption,
        images: entry.imageUrl ? [entry.imageUrl] : [],
      },
    };
  } catch (error) {
    console.error('Error fetching entry metadata:', error);
    return {
      title: 'Bidrag',
      description: 'Se dette bidrag og stem på din favorit',
    };
  }
}

export default function EntryLayout({ children }) {
  return children;
}
