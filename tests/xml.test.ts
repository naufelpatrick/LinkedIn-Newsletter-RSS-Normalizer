import { describe, expect, it } from "vitest";
import { normalizeFeed } from "../lib/xml";

const feed = `<?xml version="1.0"?><rss version="2.0"><channel><title>NotÃ­cias</title><link>https://example.com</link><description>DescriÃ§Ã£o</description><item><title>AÃ§Ã£o</title><link>https://example.com/1</link><pubDate>Tue, 12 Aug 2025 12:00:00 GMT</pubDate><description><![CDATA[<h2>OlÃ¡</h2><p>Texto <a href="https://example.com">com link</a>.</p><img src="https://example.com/x.jpg"><script>alert(1)</script>]]></description><enclosure url="https://example.com/cover.jpg" type="image/jpeg"/></item></channel></rss>`;

describe("normalizeFeed", () => {
  it("generates importer-friendly RSS and keeps safe rich HTML", () => {
    const result = normalizeFeed(feed);
    expect(result.xml).toContain("<title>Ação</title>");
    expect(result.xml).toContain("<content:encoded><![CDATA[<h2>Olá</h2>");
    expect(result.xml).toContain('<enclosure url="https://example.com/cover.jpg" type="image/jpeg"/>');
    expect(result.xml).not.toContain("<script>");
    expect(result.diagnostic).toMatchObject({ feedDetected: true, itemsFound: 1, encodingIssuesDetected: true, contentEncodedGenerated: true, imagesFound: 2 });
  });
  it("rejects entity declarations", () => {
    expect(() => normalizeFeed('<!DOCTYPE rss [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><rss/>')).toThrow(/DOCTYPE/);
  });
});
