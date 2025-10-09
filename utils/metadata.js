/**
 * Generates dynamic metadata for Next.js pages by fetching data from an API endpoint
 * @param {Object} config - Configuration object
 * @param {string} config.id - The resource ID
 * @param {string} config.endpoint - The API endpoint path (e.g., '/api/competitions', '/api/entries')
 * @param {string} config.dataKey - The key to extract data from response (optional)
 * @param {string} config.fallbackTitle - Title to use if fetch fails
 * @param {string} config.fallbackDescription - Description to use if fetch fails
 * @param {Function} config.buildMetadata - Function to build metadata from fetched data
 * @returns {Promise<Object>} Next.js metadata object
 */
export async function generateDynamicMetadata({
  id,
  endpoint,
  dataKey,
  fallbackTitle,
  fallbackDescription,
  buildMetadata,
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}${endpoint}/${id}`, {
      next: { revalidate: 60 }, // Cache for 60 seconds
      signal: AbortSignal.timeout(5000), // 5-second timeout
    });

    if (!res.ok) {
      return { title: fallbackTitle, description: fallbackDescription };
    }

    const data = await res.json();
    const resource = dataKey ? data[dataKey] : data;

    if (!resource) {
      console.warn(`Missing expected data key: ${dataKey}`);
      return { title: fallbackTitle, description: fallbackDescription };
    }

    return buildMetadata(resource);
  } catch (error) {
    console.error(`Error fetching ${endpoint} metadata:`, error);
    return { title: fallbackTitle, description: fallbackDescription };
  }
}
