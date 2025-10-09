import { generateDynamicMetadata } from '@/utils/metadata';

export async function generateMetadata({ params }) {
  const { id } = await params;

  return generateDynamicMetadata({
    id,
    endpoint: '/api/competitions',
    dataKey: 'competition',
    fallbackTitle: 'Konkurrence',
    fallbackDescription: 'Se konkurrencen og deltag for at vinde præmier',
    buildMetadata: (competition) => ({
      title: competition.title,
      description:
        competition.description ||
        `Deltag i konkurrencen "${competition.title}" og vind ${competition.prize || 'præmier'}`,
      openGraph: {
        title: competition.title,
        description:
          competition.description ||
          `Deltag i konkurrencen "${competition.title}"`,
        images: competition.image
          ? [
              {
                url: competition.image,
                width: 1200,
                height: 630,
                alt: competition.title,
              },
            ]
          : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: competition.title,
        description:
          competition.description ||
          `Deltag i konkurrencen "${competition.title}"`,
        images: competition.image ? [competition.image] : [],
      },
    }),
  });
}

export default function CompetitionLayout({ children }) {
  return children;
}
