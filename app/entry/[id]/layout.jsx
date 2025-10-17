import { generateDynamicMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  return generateDynamicMetadata({
    id,
    endpoint: '/api/entries',
    dataKey: 'entry',
    fallbackTitle: 'Bidrag',
    fallbackDescription: 'Se dette bidrag og stem på din favorit',
    buildMetadata: (entry) => {
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
    },
  });
}

export default function EntryLayout({ children }) {
  return children;
}
