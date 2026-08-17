"use client";

import { FormEvent, useState } from "react";

export function FeedBuilder() {
  const [source, setSource] = useState("");
  const [error, setError] = useState("");

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
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  function diagnose() {
    const url = endpointUrl("debug");
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form className="feedForm" onSubmit={submit} noValidate>
      <label htmlFor="source">Paste your existing RSS feed URL</label>
      <div className="inputRow">
        <input id="source" name="source" type="url" inputMode="url" placeholder="https://example.com/feed.xml" value={source} onChange={(event) => setSource(event.target.value)} aria-describedby={error ? "source-error" : "source-help"} />
        <button type="submit">Normalize feed <span aria-hidden="true">→</span></button>
      </div>
      <div className="formMeta">
        {error ? <p className="formError" id="source-error" role="alert">{error}</p> : <p id="source-help">Accepts public HTTP(S) RSS 2.0 feeds up to 5 MB.</p>}
        <button className="debugButton" type="button" onClick={diagnose}>Run diagnostics</button>
      </div>
    </form>
  );
}
