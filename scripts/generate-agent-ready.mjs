#!/usr/bin/env node
/**
 * Generates agent-discovery assets for FR + COM sites under asset-src/.
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const sites = [
  {
    id: 'com',
    origin: 'https://monsieurclick.com',
    lang: 'en',
    brand: 'Monsieur Click',
    scoreApi: 'https://score.monsieurclick.com',
    mcpName: 'Monsieur Click Score API',
    toolName: 'calculate_seo_score',
    toolDesc: 'Calculate an SEO score for a business website URL.',
    getQuoteDesc: 'Open the SEO audit quote request page for a business website.',
    openapiTitle: 'Monsieur Click Score API',
    openapiDesc: 'Public SEO score calculator used by Monsieur Click tools and demos.',
    docsTitle: 'Score API documentation',
    docsBody: `## Overview

Public JSON API that returns an SEO score for a website URL.

## Base URL

\`https://score.monsieurclick.com\`

## Endpoints

### \`GET /api/health\`

Health check for the Monsieur Click site edge.

### Soft agent registration

\`POST https://monsieurclick.com/api/agent/register\`

Optional agent declaration. No OAuth client credentials are required for public discovery.

### Soft agent identity

\`POST https://monsieurclick.com/api/agent/identity\`

Returns a soft identity assertion for agents that want to declare themselves.

## Authentication

Read-only discovery and the public score calculator do not require bearer tokens.
`,
  },
  {
    id: 'fr',
    origin: 'https://monsieurclick.fr',
    lang: 'fr',
    brand: 'Monsieur Click',
    scoreApi: 'https://score.monsieurclick.com',
    mcpName: 'API Score Monsieur Click',
    toolName: 'calculer_score_seo',
    toolDesc: "Calcule un score SEO pour l'URL d'un site web professionnel.",
    getQuoteDesc: 'Ouvre la page de demande de devis audit SEO.',
    openapiTitle: 'API Score Monsieur Click',
    openapiDesc: 'Calculateur public de score SEO utilisé par les outils Monsieur Click.',
    docsTitle: 'Documentation API Score',
    docsBody: `## Vue d'ensemble

API JSON publique qui renvoie un score SEO pour l'URL d'un site.

## URL de base

\`https://score.monsieurclick.com\`

## Endpoints

### \`GET /api/health\`

Santé de l'edge du site Monsieur Click.

### Enregistrement soft d'agent

\`POST https://monsieurclick.fr/api/agent/register\`

Déclaration optionnelle. Aucun identifiant OAuth n'est requis pour la découverte publique.

### Identité soft

\`POST https://monsieurclick.fr/api/agent/identity\`

Renvoie une assertion d'identité soft pour les agents qui souhaitent se déclarer.

## Authentification

La découverte en lecture seule et le calculateur public ne nécessitent pas de jeton bearer.
`,
  },
];

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  console.log('wrote', path.replace(root + '/', ''));
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function buildSite(site) {
  const base = join(root, 'sites', site.id, 'asset-src');
  const wellKnown = join(base, '.well-known');

  const openapi = {
    openapi: '3.1.0',
    info: {
      title: site.openapiTitle,
      version: '1.0.0',
      description: site.openapiDesc,
      contact: {
        name: 'Monsieur Click',
        url: site.origin,
        email: 'contact@monsieurclick.com',
      },
    },
    servers: [{ url: site.scoreApi }],
    paths: {
      '/': {
        get: {
          operationId: 'getScoreHome',
          summary: 'Score API entry',
          responses: {
            '200': {
              description: 'OK',
              content: { 'text/html': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/api/score': {
        get: {
          operationId: 'getSeoScore',
          summary: 'Calculate SEO score for a URL',
          parameters: [
            {
              name: 'url',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'uri' },
              description: 'Website URL to score',
            },
          ],
          responses: {
            '200': {
              description: 'Score result',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      url: { type: 'string' },
                      score: { type: 'number' },
                      details: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  const apiCatalog = {
    linkset: [
      {
        anchor: `${site.scoreApi}/`,
        'service-desc': [
          {
            href: `${site.origin}/.well-known/openapi-score.json`,
            type: 'application/openapi+json',
          },
        ],
        'service-doc': [
          {
            href: `${site.origin}/docs/api`,
            type: 'text/html',
          },
          {
            href: `${site.origin}/docs/api.md`,
            type: 'text/markdown',
          },
        ],
        status: [
          {
            href: `${site.origin}/api/health`,
            type: 'application/json',
          },
        ],
      },
      {
        anchor: `${site.origin}/mcp`,
        'service-desc': [
          {
            href: `${site.origin}/.well-known/mcp/server-card.json`,
            type: 'application/json',
          },
        ],
        'service-doc': [
          {
            href: `${site.origin}/docs/api`,
            type: 'text/html',
          },
        ],
        status: [
          {
            href: `${site.origin}/api/health`,
            type: 'application/json',
          },
        ],
      },
    ],
  };

  const mcpCard = {
    $schema: 'https://static.modelcontextprotocol.io/schemas/server-card/v1.json',
    serverInfo: {
      name: site.mcpName,
      version: '1.0.0',
      description: site.openapiDesc,
      icons: [{ src: `${site.origin}/favicon.svg`, sizes: ['any'], type: 'image/svg+xml' }],
    },
    transport: {
      type: 'streamable-http',
      endpoint: `${site.origin}/mcp`,
    },
    capabilities: {
      tools: { listChanged: false },
    },
    tools: [
      {
        name: site.toolName,
        description: site.toolDesc,
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              format: 'uri',
              description: 'Website URL to score',
            },
          },
          required: ['url'],
        },
      },
    ],
    authentication: {
      required: false,
      schemes: [],
    },
  };

  const agentCard = {
    name: site.mcpName,
    description: site.openapiDesc,
    version: '1.0.0',
    protocolVersion: '0.3.0',
    url: `${site.origin}/mcp`,
    preferredTransport: 'JSONRPC',
    supportedInterfaces: [{ url: `${site.origin}/mcp`, protocol: 'JSONRPC' }],
    additionalInterfaces: [{ url: `${site.origin}/mcp`, transport: 'JSONRPC' }],
    provider: {
      organization: 'Monsieur Click',
      url: site.origin,
    },
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: false,
    },
    defaultInputModes: ['text/plain', 'application/json'],
    defaultOutputModes: ['application/json', 'text/plain'],
    skills: [
      {
        id: site.toolName,
        name: site.toolName,
        description: site.toolDesc,
        tags: ['seo', 'score', 'audit'],
        examples: ['Score https://example.com'],
        inputModes: ['text/plain', 'application/json'],
        outputModes: ['application/json'],
      },
    ],
    supportsAuthenticatedExtendedCard: false,
  };

  const protectedResource = {
    resource: `${site.origin}/`,
    resource_name: site.brand,
    authorization_servers: [site.origin],
    scopes_supported: ['score:read', 'score:submit', 'agent:register'],
    bearer_methods_supported: ['header'],
    resource_documentation: `${site.origin}/auth.md`,
  };

  const agentAuth = {
    skill: `${site.origin}/auth.md`,
    register_uri: `${site.origin}/api/agent/register`,
    identity_endpoint: `${site.origin}/api/agent/identity`,
    claim_endpoint: `${site.origin}/api/agent/identity`,
    claim_uri: `${site.origin}/api/agent/identity`,
    revocation_uri: `${site.origin}/api/oauth/token`,
    events_endpoint: `${site.origin}/api/agent/identity`,
    documentation: `${site.origin}/AUTH.md`,
    identity_types_supported: ['anonymous', 'verified_email', 'identity_assertion'],
    supported_identity_types: ['anonymous', 'verified_email', 'identity_assertion'],
    supported_credential_types: ['none', 'api_key', 'client_credentials'],
    anonymous: {
      credential_types_supported: ['api_key', 'none'],
      claim_uri: `${site.origin}/api/agent/identity`,
    },
    identity_assertion: {
      assertion_types_supported: [
        'verified_email',
        'urn:ietf:params:oauth:token-type:id-jag',
      ],
    },
    verified_email: {
      claim_uri: `${site.origin}/api/agent/identity`,
    },
    events_supported: [
      'https://schemas.workos.com/events/agent/auth/identity/assertion/revoked',
    ],
  };

  const authServer = {
    issuer: site.origin,
    authorization_endpoint: `${site.origin}/auth.md`,
    token_endpoint: `${site.origin}/api/oauth/token`,
    registration_endpoint: `${site.origin}/api/agent/register`,
    revocation_endpoint: `${site.origin}/api/oauth/token`,
    jwks_uri: `${site.origin}/.well-known/jwks.json`,
    response_types_supported: ['token', 'code'],
    grant_types_supported: [
      'client_credentials',
      'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'urn:workos:agent-auth:grant-type:claim',
    ],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post'],
    code_challenge_methods_supported: ['S256'],
    scopes_supported: ['score:read', 'score:submit', 'agent:register'],
    service_documentation: `${site.origin}/auth.md`,
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['RS256'],
    agent_auth: agentAuth,
  };

  const jwks = { keys: [] };

  const authMd = `# auth.md

You are an agent. Monsieur Click supports **soft agentic registration** for public discovery endpoints.

Public score + discovery resources do **not** require OAuth bearer tokens. Soft registration is available if you want a tracking \`client_id\` / \`api_key\`.

## Step 1 — Discover

### 1a. Protected Resource Metadata

\`GET ${site.origin}/.well-known/oauth-protected-resource\`

### 1b. Authorization Server metadata (includes \`agent_auth\`)

\`GET ${site.origin}/.well-known/oauth-authorization-server\`

Also published at \`${site.origin}/.well-known/openid-configuration\`.

## Step 2 — Soft register

\`POST ${site.origin}/api/agent/register\`

\`\`\`json
{
  "name": "example-agent",
  "email": "agent@example.com",
  "purpose": "SEO audit automation"
}
\`\`\`

## Step 3 — Soft identity (optional)

\`POST ${site.origin}/api/agent/identity\`

\`\`\`json
{ "type": "anonymous" }
\`\`\`

## Step 4 — Token endpoint (soft)

\`POST ${site.origin}/api/oauth/token\`

Public discovery and the score calculator do not require a bearer token. The token endpoint explains that OAuth is not required for public resources.

## Resources

| Rel | URL |
| --- | --- |
| api-catalog | ${site.origin}/.well-known/api-catalog |
| OpenAPI | ${site.origin}/.well-known/openapi-score.json |
| MCP card | ${site.origin}/.well-known/mcp/server-card.json |
| A2A agent card | ${site.origin}/.well-known/agent-card.json |
| skills | ${site.origin}/.well-known/agent-skills/index.json |
| PRM | ${site.origin}/.well-known/oauth-protected-resource |
| AS metadata | ${site.origin}/.well-known/oauth-authorization-server |
| llms.txt | ${site.origin}/llms.txt |

## NAP

Monsieur Click — 24 bis sentier des fosses rouges, 92240 Malakoff, France — +33 6 60 76 15 23 — ${site.origin}
`;

  const skillBodies = {
    'seo-score': {
      name: 'seo-score',
      description: site.toolDesc,
      body: `---
name: seo-score
description: ${site.toolDesc}
---

# SEO Score

Call \`${site.scoreApi}\` or the MCP tool \`${site.toolName}\` with a website URL to obtain an SEO score used by Monsieur Click demos and audits.
`,
    },
    'request-quote': {
      name: 'request-quote',
      description: site.getQuoteDesc,
      body: `---
name: request-quote
description: ${site.getQuoteDesc}
---

# Request quote

Guide the user to ${site.origin}/offres or ${site.origin}/pricing depending on locale, or use the WebMCP tool \`open_free_diagnostic\`.
`,
    },
    'contact-diagnostic': {
      name: 'contact-diagnostic',
      description:
        site.lang === 'fr'
          ? 'Ouvre le diagnostic SEO gratuit Monsieur Click'
          : 'Open the free Monsieur Click SEO diagnostic',
      body: `---
name: contact-diagnostic
description: ${
        site.lang === 'fr'
          ? 'Ouvre le diagnostic SEO gratuit Monsieur Click'
          : 'Open the free Monsieur Click SEO diagnostic'
      }
---

# Contact / diagnostic

Send the user to ${site.origin}/contact or call the WebMCP tool \`open_free_diagnostic\`.
`,
    },
  };

  const skillEntries = [];
  for (const skill of Object.values(skillBodies)) {
    const skillPath = join(wellKnown, 'agent-skills', skill.name, 'SKILL.md');
    write(skillPath, skill.body);
    skillEntries.push({
      name: skill.name,
      type: 'skill',
      description: skill.description,
      url: `${site.origin}/.well-known/agent-skills/${skill.name}/SKILL.md`,
      sha256: sha256(skill.body),
    });
  }

  const skillsIndex = {
    $schema: 'https://agentskills.io/schemas/discovery/v0.2.0.json',
    version: '0.2.0',
    name: `${site.brand} Agent Skills`,
    description: `Discoverable agent skills for ${site.brand}`,
    skills: skillEntries,
  };

  const docsApi = `# ${site.docsTitle}

${site.docsBody}
`;

  write(join(wellKnown, 'api-catalog'), JSON.stringify(apiCatalog, null, 2) + '\n');
  write(join(wellKnown, 'openapi-score.json'), JSON.stringify(openapi, null, 2) + '\n');
  write(join(wellKnown, 'mcp', 'server-card.json'), JSON.stringify(mcpCard, null, 2) + '\n');
  write(join(wellKnown, 'agent-card.json'), JSON.stringify(agentCard, null, 2) + '\n');
  write(join(wellKnown, 'agent.json'), JSON.stringify(agentCard, null, 2) + '\n');
  write(join(wellKnown, 'oauth-protected-resource'), JSON.stringify(protectedResource, null, 2) + '\n');
  write(join(wellKnown, 'oauth-authorization-server'), JSON.stringify(authServer, null, 2) + '\n');
  write(join(wellKnown, 'openid-configuration'), JSON.stringify(authServer, null, 2) + '\n');
  write(join(wellKnown, 'jwks.json'), JSON.stringify(jwks, null, 2) + '\n');
  write(join(wellKnown, 'agent-skills', 'index.json'), JSON.stringify(skillsIndex, null, 2) + '\n');
  write(join(base, 'auth.md'), authMd);
  write(join(base, 'AUTH.md'), authMd);
  write(join(base, 'docs', 'api.md'), docsApi);
}

for (const site of sites) buildSite(site);
console.log('Agent-ready assets generated.');
