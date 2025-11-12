import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { z } from 'zod';

export const postPath = '/api/mcp/messages';
export const sessions = new Map<string, { server: McpServer; transport: SSEServerTransport }>();

export function createServerInstance() {
  const mcp = new McpServer({ name: 'example-mcp-server', version: '0.1.0' }, {
    capabilities: { resources: {}, tools: {} },
    instructions: 'Example MCP server exposing welcome + status resources and echo/add tools.'
  });

  mcp.registerResource('welcome', 'memory://welcome', { description: 'Basic welcome text', mimeType: 'text/plain' }, async () => ({
    contents: [{ uri: 'memory://welcome', mimeType: 'text/plain', text: 'Hello from the MCP server!' }]
  }));
  mcp.registerResource('status', 'memory://status', { description: 'Server status info', mimeType: 'application/json' }, async () => ({
    contents: [{ uri: 'memory://status', mimeType: 'application/json', text: JSON.stringify({ uptime: process.uptime() }, null, 2) }]
  }));

  mcp.registerTool('echo', { description: 'Echo back a provided message', inputSchema: { message: z.string() } }, async ({ message }) => ({
    content: [{ type: 'text', text: message }]
  }));
  mcp.registerTool('add', { description: 'Add two numbers', inputSchema: { a: z.number(), b: z.number() } }, async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }]
  }));

  return mcp;
}

// Lightweight metadata for JSON preview (not full resource contents)
export const resourceList = [
  { id: 'welcome', uri: 'memory://welcome', description: 'Basic welcome text', mimeType: 'text/plain' },
  { id: 'status', uri: 'memory://status', description: 'Server status info', mimeType: 'application/json' }
];
export const toolList = [
  { name: 'echo', description: 'Echo back a provided message', inputSchema: { message: 'string' } },
  { name: 'add', description: 'Add two numbers', inputSchema: { a: 'number', b: 'number' } }
];

export {};