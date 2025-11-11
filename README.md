# EX MCP React

A minimal React Hello World app plus an example Model Context Protocol (MCP) server exposing simple resources and tools you can connect to ChatGPT (MCP client) via `openai.json`.

## Features
- React + TypeScript + Vite hello world
- MCP server (stdio) with resources (`welcome`, `status`) and tools (`echo`, `add`)
- Ready `openai.json` example config for ChatGPT MCP integration

## Install
```bash
npm install
```

## Run Dev Server
```bash
npm run dev
```
Visit http://localhost:5173

## Run MCP Server Directly
```bash
npm run mcp-server
```
This starts the stdio MCP server.

## ChatGPT MCP Integration
Copy `openai.json` into your ChatGPT MCP configuration directory (or merge its `mcpServers` entry). ChatGPT will spawn the server via the npm script and you can call listed resources and tools.

## Tools
- `echo` (text): returns the provided `message`
- `add` (text): returns `a + b`

## Resources
- `memory://welcome` plain text greeting
- `memory://status` JSON uptime payload

## Notes
You may need `@types/node` for Node globals if TypeScript complains.

## Next Ideas
- Persist resources to disk
- Add authentication
- Expand tools with side effects
