'use client';

import { useEffect } from "react";

type NextChatSDKBootstrapProps = {
  baseUrl: string;
};

const normalizeUrl = (urlCandidate: string, baseUrl: string) => {
  try {
    if (!baseUrl) {
      return urlCandidate;
    }

    const base = new URL(baseUrl);
    const normalized = new URL(urlCandidate, base);
    return normalized.toString();
  } catch {
    return urlCandidate;
  }
};

export function NextChatSDKBootstrap({
  baseUrl,
}: NextChatSDKBootstrapProps): null {
  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const wrapHistoryCall =
      (original: typeof window.history.pushState) =>
      (...args: Parameters<typeof window.history.pushState>) => {
        const nextUrl =
          typeof args[2] === "string"
            ? normalizeUrl(args[2], baseUrl)
            : args[2];
        return original.call(window.history, args[0], args[1], nextUrl);
      };

    window.history.pushState = wrapHistoryCall(originalPushState);
    window.history.replaceState = wrapHistoryCall(originalReplaceState);

    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [baseUrl]);

  useEffect(() => {
    if (!baseUrl) {
      return;
    }

    const originalFetch = window.fetch;
    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (typeof input === "string") {
        return originalFetch(normalizeUrl(input, baseUrl), init);
      }

      if (input instanceof URL) {
        return originalFetch(normalizeUrl(input.toString(), baseUrl), init);
      }

      return originalFetch(input, init);
    };

    const observer = new MutationObserver(() => {
      document.documentElement.setAttribute("data-next-chat-bootstrap", "true");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-next-chat-bootstrap"],
    });

    document.documentElement.setAttribute("data-next-chat-bootstrap", "true");

    return () => {
      window.fetch = originalFetch;
      observer.disconnect();
      document.documentElement.removeAttribute("data-next-chat-bootstrap");
    };
  }, [baseUrl]);

  return null;
}
