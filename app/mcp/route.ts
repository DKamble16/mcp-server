import { NextRequest } from "next/server";

export const runtime = "edge";

type JsonRpcRequest = {
  id: string | number | null;
  method: string;
  params?: Record<string, unknown>;
};

type JsonRpcSuccess = {
  jsonrpc: "2.0";
  id: JsonRpcRequest["id"];
  result: Record<string, unknown>;
};

type JsonRpcError = {
  jsonrpc: "2.0";
  id: JsonRpcRequest["id"];
  error: {
    code: number;
    message: string;
  };
};

const resolveBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "";
};

const baseUrl = resolveBaseUrl();
const templateUri = baseUrl ? `${baseUrl}/` : "/";

const openAiMetadata = {
  "openai/outputTemplate": {
    widget: {
      templateUri,
    },
  },
  "openai/toolInvocation/invoking": "Loading...",
  "openai/toolInvocation/invoked": "Loaded",
  "openai/widgetAccessible": false,
  "openai/resultCanProduceWidget": true,
};

const helloTool = {
  name: "hello_world",
  description: "Returns a friendly greeting rendered inside your ChatGPT app.",
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Optional name to greet. Defaults to World.",
      },
    },
  },
  metadata: openAiMetadata,
};

const helloResource = {
  uri: `${templateUri}#hello-world`,
  name: "hello-world-ui",
  description: "Hello World UI served by this Next.js app.",
  mimeType: "text/html",
  metadata: openAiMetadata,
};

const jsonResponse = (payload: JsonRpcSuccess | JsonRpcError, init?: ResponseInit) =>
  new Response(JSON.stringify(payload), {
    headers: {
      "content-type": "application/json",
    },
    ...init,
  });

const methodNotAllowed = (id: JsonRpcRequest["id"]) =>
  jsonResponse(
    {
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: "Method not allowed.",
      },
    },
    { status: 405 }
  );

export async function GET() {
  return methodNotAllowed(null);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as JsonRpcRequest | null;

  if (!body || !body.method) {
    return jsonResponse(
      {
        jsonrpc: "2.0",
        id: body?.id ?? null,
        error: {
          code: -32600,
          message: "Invalid request payload.",
        },
      },
      { status: 400 }
    );
  }

  switch (body.method) {
    case "tools.list":
      return jsonResponse({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          tools: [helloTool],
        },
      });
    case "resources.list":
      return jsonResponse({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          resources: [helloResource],
        },
      });
    case "tools.call": {
      const params = (body.params ?? {}) as Record<string, unknown>;
      const rawName = typeof params["name"] === "string" ? (params["name"] as string) : null;
      const name = typeof rawName === "string" && rawName.length > 0 ? rawName : "World";
      const greeting = `Hello, ${name}!`;

      return jsonResponse({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: greeting,
          metadata: openAiMetadata,
        },
      });
    }
    default:
      return methodNotAllowed(body.id);
  }
}
