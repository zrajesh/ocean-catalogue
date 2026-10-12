"use client";

import { useCallback, useEffect, useState } from "react";

type PdfLoadState =
  | { status: "loading"; percent: number | null; loadedBytes: number; totalBytes: number | null }
  | { status: "ready"; objectUrl: string }
  | { status: "error" };

const INITIAL: PdfLoadState = { status: "loading", percent: 0, loadedBytes: 0, totalBytes: null };

/** Streams the PDF so progress can be shown; the HTTP cache makes a preloaded file resolve instantly. */
export function usePdfLoader(url: string) {
  const [state, setState] = useState<PdfLoadState>(INITIAL);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | null = null;

    const load = async () => {
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);

        const totalBytes = Number(response.headers.get("content-length")) || null;
        const reader = response.body.getReader();
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        let loadedBytes = 0;

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value as Uint8Array<ArrayBuffer>);
          loadedBytes += value.length;
          const percent = totalBytes ? Math.min(99, Math.round((loadedBytes / totalBytes) * 100)) : null;
          setState({ status: "loading", percent, loadedBytes, totalBytes });
        }

        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "application/pdf" }));
        setState({ status: "ready", objectUrl });
      } catch {
        if (controller.signal.aborted) return;
        setState({ status: "error" });
      }
    };

    load();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [url, attempt]);

  const retry = useCallback(() => {
    setState(INITIAL);
    setAttempt((count) => count + 1);
  }, []);

  return { state, retry };
}
