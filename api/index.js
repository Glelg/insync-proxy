export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  const url = new URL(request.url);

  // 1. Постеры TMDB
  if (url.pathname.startsWith('/t/p/')) {
    const imageUrl = 'https://image.tmdb.org' + url.pathname + url.search;
    return fetch(imageUrl, {
      method: request.method,
      headers: request.headers,
    });
  }

  // 2. Поиск фильмов TMDB
  if (url.pathname.startsWith('/3/')) {
    const tmdbUrl = 'https://api.themoviedb.org' + url.pathname + url.search;
    const headers = new Headers(request.headers);
    headers.set('Host', 'api.themoviedb.org');
    const bodyText = (request.method !== 'GET' && request.method !== 'HEAD') ? await request.text() : undefined;
    return fetch(tmdbUrl, {
      method: request.method,
      headers: headers,
      body: bodyText,
    });
  }

  // 3. База данных и Авторизация Supabase
  const supabaseHost = 'dmttnikxubvhxihohbmq.supabase.co';

  // Если это WebSocket соединение (Realtime)
  if (request.headers.get('Upgrade') === 'websocket') {
    const wsUrl = 'https://' + supabaseHost + url.pathname + url.search;
    return fetch(wsUrl, request);
  }

  const targetUrl = 'https://' + supabaseHost + url.pathname + url.search;
  const modifiedHeaders = new Headers(request.headers);
  modifiedHeaders.set('Host', supabaseHost);

  const bodyText = (request.method !== 'GET' && request.method !== 'HEAD') ? await request.text() : undefined;

  return fetch(targetUrl, {
    method: request.method,
    headers: modifiedHeaders,
    body: bodyText,
  });
}
