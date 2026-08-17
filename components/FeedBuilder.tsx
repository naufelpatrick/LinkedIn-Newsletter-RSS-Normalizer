"use client";

import { FormEvent, useState } from "react";

export function FeedBuilder() {
  const [source, setSource] = useState("");
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [copied, setCopied] = useState(false);

  function endpointUrl(endpoint: "rss" | "debug") {
    try {
      const parsed = new URL(source);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
      setError("");
      return `/api/${endpoint}?source=${encodeURIComponent(parsed.href)}`;
    } catch {
      setError("Enter a valid public HTTP or HTTPS feed URL.");
      return null;
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = endpointUrl("rss");
    if (url) {
      setResultUrl(new URL(url, window.location.origin).href);
      setCopied(false);
    }
  }

  function diagnose() {
    const url = endpointUrl("debug");
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(resultUrl);
      setCopied(true);
    } catch {
      setError("Could not copy automatically. Select the generated URL and copy it manually.");
    }
  }

  return (
    <form className="feedForm" onSubmit={submit} noValidate>
      <label htmlFor="source">Paste your existing RSS feed URL</label>
      <div className="inputRow">
        <input id="source" name="source" type="url" inputMode="url" placeholder="https://example.com/feed.xml" value={source} onChange={(event) => { setSource(event.target.value); setResultUrl(""); setCopied(false); }} aria-describedby={error ? "source-error" : "source-help"} />
        <button type="submit">Generate feed URL <span aria-hidden="true">→</span></button>
      </div>
      <div className="formMeta">
        {error ? <p className="formError" id="source-error" role="alert">{error}</p> : <p id="source-help">Accepts public HTTP(S) RSS 2.0 feeds up to 5 MB.</p>}
        <button className="debugButton" type="button" onClick={diagnose}>Run diagnostics</button>
      </div>
      {resultUrl && (
        <div className="result" aria-live="polite">
          <div className="resultHeading"><strong>Your normalized feed is ready</strong><span>Copy this URL into Substack or another RSS importer.</span></div>
          <div className="resultUrl"><input aria-label="Generated normalized feed URL" value={resultUrl} readOnly onFocus={(event) => event.currentTarget.select()} /><button className="copyButton" type="button" onClick={copyResult}>{copied ? "Copied!" : "Copy URL"}</button></div>
          <div className="resultActions"><a href={resultUrl} target="_blank" rel="noreferrer">Open normalized feed ↗</a><button className="debugButton" type="button" onClick={diagnose}>Run diagnostics ↗</button></div>
        </div>
      )}
    </form>
  );
}
