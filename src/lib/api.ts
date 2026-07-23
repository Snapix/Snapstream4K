const TMDB_ADDON_BASE = 'https://94c8cb9f702d-tmdb-addon.baby-beamup.club';
const CINEMETA_BASE = 'https://v3-cinemeta.strem.io';
const TORRENTIO_ENDPOINTS = [
  'https://torrentio.strem.fun/lite',
  'https://torrentio.strem.fun',
  'https://torrentio.strem.fun/qualityfilter=brremux,hdrall,dolbyvision,dolbyvisionwithhdr,4k,1080p,720p,480p,cam,other'
];

const fetchWithTimeout = async (url: string, ms = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export async function fetchCatalog(type: 'movie' | 'series', catalogId: string, skip: number = 0) {
  try {
    // If TMDB addon is requested, translate it to Cinemeta's top catalog
    // because the TMDB addon appears to be offline or returning 404s.
    let base = CINEMETA_BASE;
    let actualCatalogId = catalogId;
    
    if (catalogId.startsWith('tmdb')) {
      actualCatalogId = 'top';
    }

    const url = `${base}/catalog/${type}/${actualCatalogId}${skip > 0 ? `/skip=${skip}` : ''}.json`;
    const res = await fetchWithTimeout(url);
    
    if (!res.ok) {
      throw new Error('Failed to fetch catalog');
    }
    
    const data = await res.json();
    return data.metas || [];
  } catch (error) {
    return [];
  }
}

export async function fetchSearch(query: string) {
  try {
    const [movieRes, seriesRes] = await Promise.all([
      fetchWithTimeout(`${CINEMETA_BASE}/catalog/movie/top/search=${encodeURIComponent(query)}.json`),
      fetchWithTimeout(`${CINEMETA_BASE}/catalog/series/top/search=${encodeURIComponent(query)}.json`)
    ]);
    
    let results: any[] = [];
    if (movieRes.ok) {
      const movieData = await movieRes.json();
      if (movieData.metas) results = [...results, ...movieData.metas];
    }
    if (seriesRes.ok) {
      const seriesData = await seriesRes.json();
      if (seriesData.metas) results = [...results, ...seriesData.metas];
    }
    
    return results;
  } catch (error) {
    console.error('fetchSearch error:', error);
    return [];
  }
}

export async function fetchMeta(type: 'movie' | 'series', id: string) {
  try {
    const url = `${CINEMETA_BASE}/meta/${type}/${id}.json`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) {
      throw new Error('Failed to fetch meta');
    }
    const data = await res.json();
    return data.meta || null;
  } catch (error) {
    console.error('fetchMeta error:', error);
    return null;
  }
}

export async function fetchStreams(type: 'movie' | 'series', id: string) {
  let lastError = null;
  for (const base of TORRENTIO_ENDPOINTS) {
    try {
      const url = `${base}/stream/${type}/${id}.json`;
      const res = await fetchWithTimeout(url, 8000);
      if (!res.ok) throw new Error(`Failed to fetch from ${base}: ${res.status}`);
      const data = await res.json();
      if (data && data.streams && data.streams.length > 0) {
        return data.streams;
      }
    } catch (error) {
      console.warn(`fetchStreams warning for ${base}:`, error);
      lastError = error;
    }
  }
  
  // Fallback to apibay.org
  try {
    const imdbId = id.split(':')[0];
    const fallbackUrl = `https://apibay.org/q.php?q=${imdbId}`;
    const res = await fetchWithTimeout(fallbackUrl, 8000);
    const data = await res.json();
    if (data && Array.isArray(data) && data.length > 0 && data[0].id !== '0') {
      return data
        .sort((a: any, b: any) => parseInt(b.seeders) - parseInt(a.seeders))
        .map((t: any) => ({
          name: `ThePirateBay\n${t.seeders}S / ${t.leechers}L`,
          title: t.name,
          infoHash: t.info_hash,
        }));
    }
  } catch (error) {
    console.error('fetchStreams fallback error:', error);
  }

  console.error('fetchStreams error: All endpoints failed.', lastError);
  return [];
}
