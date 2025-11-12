# Hello World ChatGPT App (Next.js)

This repository is a from-scratch implementation of the workflow outlined in the “How to Build ChatGPT Apps with Next.js and Vercel” tutorial. It exposes a minimal MCP server route, the required asset and middleware configuration, and a Hello World UI surface that can be rendered inside ChatGPT via the OpenAI Apps SDK requirements.

## Prerequisites

- Node.js 18.18+ or 20.9+ (matches the Next.js 15 runtime requirements)
- npm 9+

## 1. MCP Server Route (`app/mcp/route.ts`)

The route serves as the MCP bridge for ChatGPT:

- Registers a demo `hello_world` tool and `hello-world-ui` resource with the OpenAI metadata shown in the tutorial screenshot.
- Handles JSON-RPC `tools.list`, `resources.list`, and `tools.call` methods.
- Rejects unsupported methods with the canonical “Method not allowed” error used by the reference implementation.

You can verify the endpoint locally:

```bash
curl http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools.list"}'
```

## 2. Asset Configuration (`next.config.ts`)

`assetPrefix` is derived from `NEXT_PUBLIC_BASE_URL` (or `VERCEL_URL` when deployed) to make sure `_next` assets load correctly inside the ChatGPT iframe. Set the env var before building or running the dev server:

```bash
export NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. CORS Middleware (`middleware.ts`)

The middleware returns the expected CORS headers for all routes and short-circuits `OPTIONS` preflight requests with a `204` response, mirroring the tutorial guidance.

## 4. SDK Bootstrap (`app/layout.tsx` + `components/NextChatSDKBootstrap.tsx`)

`NextChatSDKBootstrap` patches `history` and `fetch` so the page behaves correctly when embedded in the ChatGPT iframe. It is mounted inside `app/layout.tsx` and shows a banner reminder if `NEXT_PUBLIC_BASE_URL` is missing. The layout also enables `suppressHydrationWarning`, matching the tutorial instructions.

## Hello World UI (`app/page.tsx`)

`app/page.tsx` renders a single “Hello, world.” hero card. This is the UI that the MCP resource advertises via `templateUri`, making it immediately visible once you wire the server route into ChatGPT.

## Development Workflow

1. Install dependencies (already handled by `create-next-app`, but rerun if needed):

   ```bash
   npm install
   ```

2. Export the base URL so asset prefixes and the bootstrapper know which origin to use:

   ```bash
   export NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` to see the Hello World UI or interact with the MCP endpoint at `http://localhost:3000/mcp`.

## Deployment Notes

- When deploying on Vercel, `VERCEL_URL` is picked up automatically; you can still override it with `NEXT_PUBLIC_BASE_URL` if you need a custom domain for ChatGPT.
- Keep `/mcp` server-only and add additional tools/resources there as your application grows.

That’s it—you now have all four building blocks from the tutorial wired into a clean Next.js project that renders “Hello World” inside the ChatGPT app surface.
