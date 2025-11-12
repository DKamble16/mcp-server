# EX MCP React

React + TypeScript (Vite) hello world plus a Model Context Protocol (MCP) server you can connect to ChatGPT via stdio.

## Overview
This repo contains two parts:
1. Frontend: minimal React app (`npm run dev`).
2. MCP Server: implemented with the high-level `McpServer` API (`npm run mcp-server`). Provides two resources and two tools.

## Features
* Vite + React + TS minimal setup
* MCP stdio server using `@modelcontextprotocol/sdk` `McpServer`
* Resources: `memory://welcome`, `memory://status`
* Tools: `echo` (string) and `add` (numbers)
* Example `openai.json` for ChatGPT MCP integration

## Prerequisites
* Node.js 18+ (SDK requires >=18)
* ChatGPT MCP client access (if integrating)

## Install
```bash
npm install
```

## Development
Start React dev server:
```bash
npm run dev
```
Visit http://localhost:5173.

Type-check only:
```bash
npx tsc --noEmit
```

Build production bundle:
```bash
npm run build
```

## MCP Server (Single File HTTP/SSE)
Run the combined HTTP/SSE server:
```bash
npm run mcp-server
```
Endpoints exposed by `server/mcp-server.ts`:
* `GET http://localhost:8000/mcp` – establishes SSE stream
* `POST http://localhost:8000/mcp/messages?sessionId=...` – sends protocol frames

Set `PORT` env to change port:
```bash
PORT=8010 npm run mcp-server
```

## Vercel Deployment (API Routes)
For cloud integration with ChatGPT connectors, use the provided API routes:
* `GET /api/mcp` (SSE stream) – establishes a session, returns `text/event-stream`.
* `POST /api/mcp/messages?sessionId=...` – send protocol frames for that session.

Files:
```
api/mcp.ts
api/mcp/messages.ts
api/mcp-shared.ts
```

Deploy steps:
1. Install Vercel CLI (`npm i -g vercel`) or connect repo in dashboard.
2. Run `vercel` then `vercel --prod`.
3. Test SSE:
	```bash
	curl -N -H 'Accept: text/event-stream' https://<your-app>.vercel.app/api/mcp
	```
4. Use `https://<your-app>.vercel.app/api/mcp` as MCP Server URL in ChatGPT connector.

Notes:
* You will not see normal JSON in a browser; SSE keeps an open stream.
* Default behavior now returns JSON metadata if you visit `/api/mcp` without `Accept: text/event-stream` and without `?stream=1`. Use `/api/mcp?stream=1` or an `Accept: text/event-stream` header for the live SSE stream.
* Example JSON preview response:
```json
{
	"name": "example-mcp-server",
	"version": "0.1.0",
	"resources": [
		{ "id": "welcome", "uri": "memory://welcome", "description": "Basic welcome text", "mimeType": "text/plain" },
		{ "id": "status", "uri": "memory://status", "description": "Server status info", "mimeType": "application/json" }
	],
	"tools": [
		{ "name": "echo", "description": "Echo back a provided message", "inputSchema": { "message": "string" } },
		{ "name": "add", "description": "Add two numbers", "inputSchema": { "a": "number", "b": "number" } }
	],
	"messageEndpoint": "/api/mcp/messages",
	"usage": { "streamExample": "https://<your-app>.vercel.app/api/mcp?stream=1" }
}
```
* The ChatGPT HTTP connector should still point to the SSE endpoint URL (`https://<your-app>.vercel.app/api/mcp`). It will negotiate SSE automatically; manual users can inspect JSON first.
* The client (ChatGPT) extracts `sessionId` from initial SSE events before POST calls.
* CORS is currently `*`. Tighten for production by restricting allowed origins.
* For long-lived sessions consider an Edge runtime (`export const config = { runtime: 'edge' };`).

### Resources
| URI | Description | Mime |
|-----|-------------|------|
| `memory://welcome` | Greeting text | `text/plain` |
| `memory://status` | JSON uptime info | `application/json` |

### Tools
| Name | Description | Input |
|------|-------------|-------|
| `echo` | Returns same message | `{ message: string }` |
| `add` | Adds two numbers | `{ a: number, b: number }` |

## ChatGPT MCP Integration
Copy or merge `openai.json` into your ChatGPT MCP settings. Example entry:
```json
{
	"mcpServers": {
		"example-mcp": {
			"command": "npm",
			"args": ["run", "mcp"],
			"env": {}
		}
	}
}
```
After saving, ChatGPT should list the tools and resources under the configured server name.

## Project Structure
```
index.html
src/main.tsx            # React entry
server/mcp-server.ts    # Single HTTP/SSE MCP server
openai.json             # Example ChatGPT MCP config
vite.config.ts          # Vite configuration
tsconfig.json           # TypeScript config
```

## Troubleshooting
* Missing Node globals: ensure `@types/node` is installed.
* Port conflicts: change Vite port with `--port` (e.g., `npm run dev -- --port 3000`).
* MCP not appearing: verify ChatGPT client supports MCP and `openai.json` is in correct directory.

## Next Ideas
* Persistent resource backing (filesystem / database)
* Additional tools (e.g., fetch URL, transform text)
* Authentication layer for sensitive resources
* Prompt registration for templated completions

## License
MIT
