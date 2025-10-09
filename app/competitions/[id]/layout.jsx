import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    // Fetch competition data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/competitions/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return {
        title: 'Konkurrence ikke fundet',
        description: 'Denne konkurrence kunne ikke findes.',
      };
    }

    const data = await res.json();
    const competition = data.competition || data;

    return {
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
    };
  } catch (error) {
    console.error('Error fetching competition metadata:', error);
    return {
      title: 'Konkurrence',
      description: 'Se konkurrencen og deltag for at vinde præmier',
    };
  }
}

export default function CompetitionLayout({ children }) {
  return children;
}
