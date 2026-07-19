/**
 * Web Bot Auth key directory (IETF HTTP Message Signatures Directory).
 * Serves JWKS at /.well-known/http-message-signatures-directory and signs
 * the response per draft-meunier-http-message-signatures-directory.
 *
 * Public key is also mirrored as a static asset for CDN fallbacks.
 * Override the private seed via env WEB_BOT_AUTH_D (base64url JWK "d").
 */
const PUBLIC_JWK = {
  kty: 'OKP',
  crv: 'Ed25519',
  x: 'JI-ISoaF-A4xtNfDdCXSmKShFYuo4YYrghl21wu7Cu0',
  kid: 'fkeXvvWTt8tJL3GtvFm-cm6ajZhe95oonVTDFDfRUJs',
  alg: 'EdDSA',
  use: 'sig',
};

// Site bot-identity private key material (JWK "d"). Prefer env override.
const DEFAULT_D = '7BdFWSDzKGmJWZLUISbk6dvoa1X5Ha_4V-n9k3vpr0w';

function directoryBody() {
  return JSON.stringify({
    keys: [
      {
        kty: PUBLIC_JWK.kty,
        crv: PUBLIC_JWK.crv,
        x: PUBLIC_JWK.x,
        kid: PUBLIC_JWK.kid,
        alg: PUBLIC_JWK.alg,
        use: PUBLIC_JWK.use,
      },
    ],
  });
}

function b64urlFromBytes(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function importSigningKey(d) {
  return crypto.subtle.importKey(
    'jwk',
    {
      kty: 'OKP',
      crv: 'Ed25519',
      x: PUBLIC_JWK.x,
      d,
      ext: true,
    },
    { name: 'Ed25519' },
    false,
    ['sign'],
  );
}

/**
 * Build RFC 9421 signature base for directory binding over @authority;req
 */
function signatureBase(authority, params) {
  return `"@authority";req: ${authority}\n"@signature-params": ${params}`;
}

async function signDirectoryResponse(request, env) {
  const body = directoryBody();
  const url = new URL(request.url);
  const authority = url.host;
  const created = Math.floor(Date.now() / 1000);
  const expires = created + 300;
  const keyid = PUBLIC_JWK.kid;
  const paramsInner = `("@authority";req);created=${created};keyid="${keyid}";alg="ed25519";expires=${expires};tag="http-message-signatures-directory"`;
  const base = signatureBase(authority, paramsInner);

  const d = (env && env.WEB_BOT_AUTH_D) || DEFAULT_D;
  let signatureHeader = null;
  let signatureInput = null;

  try {
    const key = await importSigningKey(d);
    const sig = await crypto.subtle.sign(
      { name: 'Ed25519' },
      key,
      new TextEncoder().encode(base),
    );
    const sigB64 = b64urlFromBytes(new Uint8Array(sig));
    signatureInput = `binding0=${paramsInner}`;
    signatureHeader = `binding0=:${sigB64}:`;
  } catch (err) {
    // Still serve JWKS if signing fails (scanner only needs keys[]).
    console.warn('web-bot-auth sign failed', err && err.message);
  }

  const headers = {
    'content-type': 'application/http-message-signatures-directory+json',
    'cache-control': 'public, max-age=300',
    'access-control-allow-origin': '*',
  };
  if (signatureInput && signatureHeader) {
    headers['signature-input'] = signatureInput;
    headers['signature'] = signatureHeader;
  }

  return new Response(body, { status: 200, headers });
}

export async function onRequest(context) {
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, HEAD, OPTIONS',
        'access-control-allow-headers': 'accept, content-type',
      },
    });
  }
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' },
    });
  }
  const res = await signDirectoryResponse(context.request, context.env);
  if (context.request.method === 'HEAD') {
    return new Response(null, { status: res.status, headers: res.headers });
  }
  return res;
}
