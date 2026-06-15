import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type } = req.query;
  const TMDB_KEY = process.env.VITE_TMDB_API_KEY;
  const RAWG_KEY = process.env.VITE_RAWG_API_KEY;

  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    if (type === 'trending-movies') {
      const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_KEY}&language=es-MX`);
      const data = await response.json();
      
      const formatted = data.results.map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        poster: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
        backdrop: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
        overview: item.overview,
        type: item.media_type === 'tv' ? 'tv' : 'movie'
      }));

      return res.status(200).json(formatted);
    } 
    
    if (type === 'trending-games') {
      // Mock para juegos o usar RAWG real si hay key
      if (RAWG_KEY) {
        const response = await fetch(`https://api.rawg.io/api/games?key=${RAWG_KEY}&ordering=-rating&page_size=10`);
        const data = await response.json();
        const formatted = data.results.map((item: any) => ({
          id: item.id,
          title: item.name,
          poster: item.background_image,
          backdrop: item.background_image,
          overview: "Juego de alta calidad disponible en la biblioteca.",
          type: 'game'
        }));
        return res.status(200).json(formatted);
      } else {
        // Fallback mock si no hay RAWG key
        return res.status(200).json([
          {
            id: 1001,
            title: "Cyberpunk 2077",
            poster: "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/2ec84b3970b42df52dd70f03e617d1e8ef097f4a56a64010.jpg",
            backdrop: "https://image.api.playstation.com/vulcan/ap/rnd/202311/2812/2ec84b3970b42df52dd70f03e617d1e8ef097f4a56a64010.jpg",
            overview: "Un juego de rol de acción de mundo abierto...",
            type: "game"
          }
        ]);
      }
    }

    return res.status(400).json({ error: 'Invalid type requested' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
