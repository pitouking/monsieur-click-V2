export async function onRequestGet() {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'monsieur-click',
      time: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'access-control-allow-origin': '*',
        'cache-control': 'no-store',
      },
    },
  );
}
