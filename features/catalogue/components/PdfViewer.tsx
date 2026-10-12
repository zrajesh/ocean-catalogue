"use client";

import { usePdfLoader } from "../hooks/usePdfLoader";

const SEGMENTS = 20;
const toMb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1);

type PdfViewerProps = { url: string; title: string };

export function PdfViewer({ url, title }: PdfViewerProps) {
  const { state, retry } = usePdfLoader(url);

  if (state.status === "ready") {
    const { objectUrl } = state;
    return <iframe className="pdf-frame" src={objectUrl} title={title} />;
  }

  if (state.status === "error") {
    return (
      <div className="pdf-status" role="alert">
        <p>The catalogue could not be loaded.</p>
        <button className="btn gold" type="button" onClick={retry}>
          Try again
        </button>
        <a href={url}>Open the PDF directly</a>
      </div>
    );
  }

  const { percent, loadedBytes, totalBytes } = state;
  const filled = percent === null ? 0 : Math.round((percent / 100) * SEGMENTS);

  return (
    <div className="pdf-status" role="status" aria-live="polite">
      <strong className="pdf-pct">{percent === null ? "Loading" : `${percent}%`}</strong>
      <div
        className={`pdf-segments${percent === null ? " indeterminate" : ""}`}
        role="progressbar"
        aria-label="Loading catalogue"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent ?? undefined}
      >
        {Array.from({ length: SEGMENTS }, (_, index) => (
          <i key={index} className={index < filled ? "on" : undefined} />
        ))}
      </div>
      <p>
        {totalBytes ? `${toMb(loadedBytes)} of ${toMb(totalBytes)} MB` : `${toMb(loadedBytes)} MB`} &middot; preparing your catalogue
      </p>
    </div>
  );
}
