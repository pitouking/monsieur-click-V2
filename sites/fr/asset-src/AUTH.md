# auth.md

You are an agent. Monsieur Click supports **soft agentic registration** for public discovery endpoints.

Public score + discovery resources do **not** require OAuth bearer tokens. Soft registration is available if you want a tracking `client_id` / `api_key`.

## Step 1 — Discover

### 1a. Protected Resource Metadata

`GET https://monsieurclick.fr/.well-known/oauth-protected-resource`

### 1b. Authorization Server metadata (includes `agent_auth`)

`GET https://monsieurclick.fr/.well-known/oauth-authorization-server`

Also published at `https://monsieurclick.fr/.well-known/openid-configuration`.

## Step 2 — Soft register

`POST https://monsieurclick.fr/api/agent/register`

```json
{
  "name": "example-agent",
  "email": "agent@example.com",
  "purpose": "SEO audit automation"
}
```

## Step 3 — Soft identity (optional)

`POST https://monsieurclick.fr/api/agent/identity`

```json
{ "type": "anonymous" }
```

## Step 4 — Token endpoint (soft)

`POST https://monsieurclick.fr/api/oauth/token`

Public discovery and the score calculator do not require a bearer token. The token endpoint explains that OAuth is not required for public resources.

## Resources

| Rel | URL |
| --- | --- |
| api-catalog | https://monsieurclick.fr/.well-known/api-catalog |
| OpenAPI | https://monsieurclick.fr/.well-known/openapi-score.json |
| MCP card | https://monsieurclick.fr/.well-known/mcp/server-card.json |
| A2A agent card | https://monsieurclick.fr/.well-known/agent-card.json |
| skills | https://monsieurclick.fr/.well-known/agent-skills/index.json |
| PRM | https://monsieurclick.fr/.well-known/oauth-protected-resource |
| AS metadata | https://monsieurclick.fr/.well-known/oauth-authorization-server |
| llms.txt | https://monsieurclick.fr/llms.txt |

## NAP

Monsieur Click — 24 bis sentier des fosses rouges, 92240 Malakoff, France — +33 6 60 76 15 23 — https://monsieurclick.fr
