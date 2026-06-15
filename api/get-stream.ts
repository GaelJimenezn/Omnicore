import type { VercelRequest, VercelResponse } from '@vercel/node';

// Usamos la instancia pública de Consumet por defecto, pero se puede configurar en el .env
const CONSUMET_URL = process.env.VITE_CONSUMET_URL || 'https://api.consumet.org';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { query, type, episode } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Falta el parámetro "query" (nombre o ID para buscar)' });
  }

  const mediaType = typeof type === 'string' ? type.toLowerCase() : 'movie';
  const queryStr = query as string;

  try {
    if (mediaType === 'anime') {
      return await handleAnimeFlow(queryStr, (episode as string) || '1', res);
    } else {
      return await handleMovieTvFlow(queryStr, mediaType, res);
    }
  } catch (error: any) {
    console.error('Error en get-stream:', error.message);
    return res.status(500).json({ error: 'Error extrayendo el stream HLS', details: error.message });
  }
}

/**
 * Flujo para Anime (Usa Gogoanime)
 */
async function handleAnimeFlow(query: string, episodeNumber: string, res: VercelResponse) {
  // 1. Buscar el anime en Gogoanime
  const searchRes = await fetch(`${CONSUMET_URL}/anime/gogoanime/${encodeURIComponent(query)}`);
  if (!searchRes.ok) throw new Error('Fallo al buscar el anime en Gogoanime');
  const searchData = await searchRes.json();
  
  if (!searchData.results || searchData.results.length === 0) {
    return res.status(404).json({ error: 'Anime no encontrado' });
  }

  // Tomamos el primer resultado (el más relevante)
  const animeId = searchData.results[0].id;

  // 2. Obtener información y lista de episodios
  const infoRes = await fetch(`${CONSUMET_URL}/anime/gogoanime/info/${animeId}`);
  if (!infoRes.ok) throw new Error('Fallo al obtener info del anime');
  const infoData = await infoRes.json();

  // Buscar el ID del episodio solicitado (por defecto el 1)
  const ep = infoData.episodes.find((e: any) => e.number === parseInt(episodeNumber)) || infoData.episodes[0];
  if (!ep) {
    return res.status(404).json({ error: 'Episodio no encontrado' });
  }

  // 3. Extraer los sources del episodio (archivos .m3u8)
  const watchRes = await fetch(`${CONSUMET_URL}/anime/gogoanime/watch/${ep.id}`);
  if (!watchRes.ok) throw new Error('Fallo al extraer enlaces del episodio');
  const watchData = await watchRes.json();

  // Filtrar y buscar la mejor resolución (ej. 1080p o default)
  const sources = watchData.sources || [];
  const bestSource = sources.find((s: any) => s.quality === '1080p') || 
                     sources.find((s: any) => s.quality === 'default') || 
                     sources[0];

  if (!bestSource) {
    return res.status(404).json({ error: 'No se encontraron sources HLS' });
  }

  return res.status(200).json({
    type: 'anime',
    provider: 'gogoanime',
    quality: bestSource.quality,
    url: bestSource.url // Enlace HLS directo (.m3u8)
  });
}

/**
 * Flujo para Películas y Series (Usa FlixHQ con Fallback a Gomovies)
 */
async function handleMovieTvFlow(query: string, type: string, res: VercelResponse) {
  // Intentamos primero con FlixHQ
  try {
    const streamData = await tryProvider('flixhq', query, type);
    return res.status(200).json(streamData);
  } catch (error) {
    console.warn('FlixHQ falló, intentando con fallback (Gomovies)...');
    // Fallback a Gomovies si FlixHQ falla
    try {
      const streamData = await tryProvider('gomovies', query, type);
      return res.status(200).json(streamData);
    } catch (fallbackError) {
      console.error('Ambos proveedores fallaron.');
      return res.status(500).json({ error: 'Servidores caídos. No se encontró HLS.' });
    }
  }
}

/**
 * Función genérica para intentar extraer de un proveedor de Películas/Series de Consumet
 */
async function tryProvider(provider: string, query: string, type: string) {
  // 1. Búsqueda en el proveedor
  const searchRes = await fetch(`${CONSUMET_URL}/movies/${provider}/${encodeURIComponent(query)}`);
  if (!searchRes.ok) throw new Error(`Fallo búsqueda en ${provider}`);
  const searchData = await searchRes.json();

  // Filtrar resultados para asegurarnos de que el tipo coincida (TV o Movie)
  const results = searchData.results.filter((r: any) => r.type.toLowerCase().includes(type === 'tv' ? 'tv' : 'movie'));
  if (results.length === 0) throw new Error(`No se encontraron resultados en ${provider}`);

  const mediaId = results[0].id;

  // 2. Obtener info y episodios
  const infoRes = await fetch(`${CONSUMET_URL}/movies/${provider}/info?id=${encodeURIComponent(mediaId)}`);
  if (!infoRes.ok) throw new Error(`Fallo info en ${provider}`);
  const infoData = await infoRes.json();

  // Para películas suele haber 1 episodio. Para TV agarramos el primero temporalmente.
  const episodes = infoData.episodes || [];
  if (episodes.length === 0) throw new Error('No hay episodios disponibles');
  
  const episodeId = episodes[0].id;

  // 3. Extraer sources
  const watchRes = await fetch(`${CONSUMET_URL}/movies/${provider}/watch?episodeId=${encodeURIComponent(episodeId)}&mediaId=${encodeURIComponent(mediaId)}`);
  if (!watchRes.ok) throw new Error(`Fallo watch en ${provider}`);
  const watchData = await watchRes.json();

  const sources = watchData.sources || [];
  const bestSource = sources.find((s: any) => s.quality === '1080p') || 
                     sources.find((s: any) => s.quality === 'auto') || 
                     sources[0];

  if (!bestSource) throw new Error('No hay sources HLS');

  return {
    type,
    provider,
    quality: bestSource.quality,
    url: bestSource.url // URL directa HLS (.m3u8)
  };
}
