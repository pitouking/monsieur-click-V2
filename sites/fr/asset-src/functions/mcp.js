function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      ...extra,
    },
  });
}

const TOOLS = [
  {
    name: 'get_business_profile',
    description: 'Return Monsieur Click NAP and contact details',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'list_services',
    description: 'List main SEO / web service URLs for this locale',
    inputSchema: {
      type: 'object',
      properties: {
        locale: { type: 'string', enum: ['en', 'fr'] },
      },
    },
  },
  {
    name: 'get_score_api_info',
    description: 'Describe the public Click First™ Score API',
    inputSchema: { type: 'object', properties: {} },
  },
];

function originFrom(request) {
  try {
    return new URL(request.url).origin;
  } catch {
    return 'https://monsieurclick.com';
  }
}

function runTool(name, args, origin) {
  const locale = args && args.locale === 'fr' ? 'fr' : origin.includes('.fr') ? 'fr' : 'en';
  if (name === 'get_business_profile') {
    return {
      name: 'Monsieur Click',
      address: '24 bis sentier des fosses rouges, 92240 Malakoff, France',
      phone: '+33660761523',
      email: 'contact@monsieurclick.com',
      method: 'Click First™',
      url: origin + '/',
    };
  }
  if (name === 'list_services') {
    if (locale === 'fr') {
      return {
        services: [
          { name: 'SEO', url: origin + '/services/seo' },
          { name: 'SEO local', url: origin + '/services/seo-local' },
          { name: 'Création de site', url: origin + '/services/creation-site-web' },
          { name: 'Google Business Profile', url: origin + '/services/google-business-profile' },
          { name: 'Visibilité IA / GEO', url: origin + '/services/visibilite-ia-geo' },
        ],
        hub: origin + '/services/',
      };
    }
    return {
      services: [
        { name: 'SEO', url: origin + '/services/seo' },
        { name: 'Local SEO', url: origin + '/services/local-seo' },
        { name: 'Web design', url: origin + '/services/web-design' },
        { name: 'Google Business Profile', url: origin + '/services/google-business-profile' },
        { name: 'GEO', url: origin + '/services/generative-engine-optimization' },
      ],
      hub: origin + '/services/',
    };
  }
  if (name === 'get_score_api_info') {
    return {
      submit: origin + '/api/score/submit',
      result: origin + '/api/score/result',
      openapi: origin + '/.well-known/openapi-score.json',
      auth: origin + '/auth.md',
    };
  }
  return { error: `Unknown tool: ${name}` };
}

async function handleMcp(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
        'access-control-allow-headers': 'content-type, accept',
      },
    });
  }

  const origin = originFrom(request);

  if (request.method === 'GET') {
    return json({
      name: 'Monsieur Click MCP',
      version: '1.0.0',
      transport: 'streamable-http',
      tools: TOOLS.map((t) => t.name),
      card: origin + '/.well-known/mcp/server-card.json',
    });
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }, 400);
  }

  const id = body.id ?? null;
  const method = body.method;

  if (method === 'initialize') {
    return json({
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'Monsieur Click MCP', version: '1.0.0' },
      },
    });
  }

  if (method === 'notifications/initialized' || method === 'ping') {
    return json({ jsonrpc: '2.0', id, result: {} });
  }

  if (method === 'tools/list') {
    return json({
      jsonrpc: '2.0',
      id,
      result: { tools: TOOLS },
    });
  }

  if (method === 'tools/call') {
    const name = body.params && body.params.name;
    const args = (body.params && body.params.arguments) || {};
    const result = runTool(name, args, origin);
    return json({
      jsonrpc: '2.0',
      id,
      result: {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        structuredContent: result,
      },
    });
  }

  return json({
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${method}` },
  });
}

export async function onRequest(context) {
  return handleMcp(context.request);
}
