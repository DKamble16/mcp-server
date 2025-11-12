import { createServerInstance, postPath, sessions } from './mcp-shared.js';
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
