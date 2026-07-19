function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization',
    },
  });
}

/** Soft token endpoint: public APIs do not require OAuth tokens. */
export async function onRequestPost() {
  return json(
    {
      error: 'unauthorized_client',
      error_description:
        'Monsieur Click public APIs do not require OAuth access tokens. Register via POST /api/agent/register and see /auth.md.',
    },
    400,
  );
}
