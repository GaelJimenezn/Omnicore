import Hls from 'hls.js';

export interface StreamResponse {
  type: string;
  provider: string;
  quality: string;
  url: string; // URL directa al .m3u8
}

/**
 * Función pura que conecta con nuestro backend (/api/get-stream) 
 * para obtener la URL del manifiesto HLS.
 */
export async function fetchVideoStream(query: string, type: 'movie' | 'tv' | 'anime', episode: string = '1'): Promise<string> {
  try {
    const response = await fetch(`/api/get-stream?query=${encodeURIComponent(query)}&type=${type}&episode=${episode}`);
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Error al obtener el stream');
    }
    const data: StreamResponse = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching video stream:', error);
    throw error;
  }
}

/**
 * Función de utilidad para inicializar HLS.js en un elemento <video>
 * Asume que tienes un `<video id="player">` en el DOM.
 */
export function initHlsPlayer(videoElementId: string, m3u8Url: string) {
  const video = document.getElementById(videoElementId) as HTMLVideoElement | null;
  if (!video) {
    console.error(`Video element with id '${videoElementId}' not found.`);
    return;
  }

  // Comprobar si HLS.js es soportado en el navegador actual
  if (Hls.isSupported()) {
    const hls = new Hls({
      // Configuraciones opcionales para optimizar buffering
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
    });
    
    hls.loadSource(m3u8Url);
    hls.attachMedia(video);
    
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      video.play().catch((e) => console.log('Autoplay prevent error:', e));
    });

    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('Network error encountered, trying to recover...');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('Media error encountered, trying to recover...');
            hls.recoverMediaError();
            break;
          default:
            console.error('Fatal HLS error, cannot recover.');
            hls.destroy();
            break;
        }
      }
    });

    return hls; // Retornamos la instancia para poder destruirla después si es necesario
  } 
  // Fallback nativo para Safari (iOS/macOS) que soporta HLS por defecto
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = m3u8Url;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  } else {
    console.error('HLS is not supported in this browser.');
  }
}
