import { createServerInstance, postPath, sessions, resourceList, toolList } from './mcp-shared.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';

// Vercel runtime config (switch to 'edge' if you need edge deployment)
export const config = { runtime: 'nodejs' };

export default async function handler(req: any, res: any) {
	// CORS / preflight
	if (req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'content-type');
		res.status(204).end();
		return;
	}

	if (req.method !== 'GET') {
		res.status(405).end('Method Not Allowed');
		return;
	}

	res.setHeader('Access-Control-Allow-Origin', '*');

	// If client wants JSON preview (default), serve metadata. SSE only when explicitly requested.
	const wantsSse = req.query.stream === '1' || /text\/event-stream/.test(req.headers.accept || '');
	if (!wantsSse) {
		res.setHeader('Content-Type', 'application/json');
		res.status(200).end(JSON.stringify({
			name: 'example-mcp-server',
			version: '0.1.0',
			resources: resourceList,
			tools: toolList,
			messageEndpoint: postPath,
			usage: {
				streamExample: `${req.headers.host ? 'https://' + req.headers.host : ''}/api/mcp?stream=1`
			}
		}));
		return;
	}

	const server = createServerInstance();
	const transport = new SSEServerTransport(postPath, res);
	const sessionId = transport.sessionId;
	sessions.set(sessionId, { server, transport });
	transport.onclose = async () => {
		sessions.delete(sessionId);
		await server.close();
	};
	transport.onerror = (err) => console.error('SSE transport error', err);
	try {
		await server.connect(transport);
	} catch (err) {
		sessions.delete(sessionId);
		console.error('Failed to establish SSE connection', err);
		if (!res.headersSent) res.status(500).end('Failed to establish SSE connection');
	}
}
