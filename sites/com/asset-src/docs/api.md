# Score API documentation

## Overview

Public JSON API that returns an SEO score for a website URL.

## Base URL

`https://score.monsieurclick.com`

## Endpoints

### `GET /api/health`

Health check for the Monsieur Click site edge.

### Soft agent registration

`POST https://monsieurclick.com/api/agent/register`

Optional agent declaration. No OAuth client credentials are required for public discovery.

### Soft agent identity

`POST https://monsieurclick.com/api/agent/identity`

Returns a soft identity assertion for agents that want to declare themselves.

## Authentication

Read-only discovery and the public score calculator do not require bearer tokens.

