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

## MCP Server
Run directly:
```bash
npm run mcp-server
```
This launches a stdio-based MCP server. It waits for a MCP client (e.g., ChatGPT) to drive requests.

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
			"args": ["run", "mcp-server"],
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
server/mcp-server.ts    # MCP server definition
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
