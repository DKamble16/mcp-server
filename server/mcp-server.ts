#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

async function main() {
  const transport = new StdioServerTransport();
  const mcp = new McpServer({ name: 'example-mcp-server', version: '0.1.0' }, {
    capabilities: { resources: {}, tools: {} },
    instructions: 'Example MCP server exposing welcome + status resources and echo/add tools.'
  });

  // Register resources
  mcp.registerResource('welcome', 'memory://welcome', { description: 'Basic welcome text', mimeType: 'text/plain' }, async () => ({
    contents: [{ uri: 'memory://welcome', mimeType: 'text/plain', text: 'Hello from the MCP server!' }]
  }));
  mcp.registerResource('status', 'memory://status', { description: 'Server status info', mimeType: 'application/json' }, async () => ({
    contents: [{ uri: 'memory://status', mimeType: 'application/json', text: JSON.stringify({ uptime: process.uptime() }, null, 2) }]
  }));

  // Register tools
  mcp.registerTool('echo', { description: 'Echo back a provided message', inputSchema: { message: z.string() } }, async ({ message }) => ({
    content: [{ type: 'text', text: message }]
  }));
  mcp.registerTool('add', { description: 'Add two numbers', inputSchema: { a: z.number(), b: z.number() } }, async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }]
  }));

  await mcp.connect(transport);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
