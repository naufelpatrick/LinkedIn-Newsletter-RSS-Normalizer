import { XMLParser } from "fast-xml-parser";
import sanitizeHtml from "sanitize-html";
import { hasEncodingIssues, repairMojibake } from "./encoding";

type XmlValue = string | number | boolean | null | undefined | Record<string, unknown>;
export interface Diagnostic { feedDetected: boolean; itemsFound: number; encodingIssuesDetected: boolean; contentEncodedGenerated: boolean; imagesFound: number; warnings: string[]; }
export interface Normalized { xml: string; diagnostic: Diagnostic; }

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_", processEntities: false, trimValues: false });
const allowedTags = [...sanitizeHtml.defaults.allowedTags, "figure", "figcaption", "img", "hr", "pre", "h1", "h2", "h3", "h4", "h5", "h6"];

const text = (value: XmlValue): string => {
  if (value == null) return "";
  if (typeof value === "object") return String(value["#text"] ?? value["__cdata"] ?? "");
  return String(value);
};
const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const cdata = (value: string) => value.replaceAll("]]>", "]]]]><![CDATA[>");
const tag = (name: string, value: string) => value ? `<${name}>${esc(value)}</${name}>` : "";
const validDate = (value: string) => value && !Number.isNaN(Date.parse(value)) ? value : "";
const first = <T>(value: T | T[] | undefined): T | undefined => Array.isArray(value) ? value[0] : value;

function simplify(html: string): string {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim().slice(0, 500);
}

export function normalizeFeed(sourceXml: string, selfUrl?: string): Normalized {
  if (/<!DOCTYPE|<!ENTITY/i.test(sourceXml)) throw new Error("DOCTYPE and ENTITY declarations are not allowed");
  const parsed = parser.parse(sourceXml) as Record<string, any>;
  const channel = parsed?.rss?.channel;
  if (!channel || typeof channel !== "object") throw new Error("RSS 2.0 channel not found");
  const rawItems = channel.item ? (Array.isArray(channel.item) ? channel.item : [channel.item]) : [];
  const sourceHadIssues = hasEncodingIssues(sourceXml);
  let imagesFound = 0;
  const items = rawItems.map((item: Record<string, XmlValue>) => {
    const title = repairMojibake(text(item.title));
    const link = repairMojibake(text(item.link)).trim();
    const rawHtml = repairMojibake(text(item["content:encoded"]) || text(item.description));
    const html = sanitizeHtml(rawHtml, {
      allowedTags,
      allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, "*": ["class"], a: ["href", "name", "target", "rel"], img: ["src", "srcset", "alt", "title", "width", "height", "loading"] },
      allowedSchemes: ["http", "https", "mailto"],
      allowProtocolRelative: false
    });
    const enclosure = first(item.enclosure as Record<string, unknown> | Record<string, unknown>[] | undefined);
    const enclosureUrl = enclosure ? text(enclosure["@_url"] as XmlValue) : "";
    const inlineImages = (html.match(/<img\b/gi) ?? []).length;
    imagesFound += inlineImages + (enclosureUrl ? 1 : 0);
    const author = repairMojibake(text(item.author || item["dc:creator"]));
    const pubDate = validDate(text(item.pubDate).trim());
    const enclosureXml = enclosureUrl ? `<enclosure url="${esc(enclosureUrl)}" type="${esc(text(enclosure?.["@_type"] as XmlValue) || "image/jpeg")}"/>` : "";
    return `<item>${tag("title", title)}${tag("link", link)}${link ? `<guid isPermaLink="true">${esc(link)}</guid>` : tag("guid", text(item.guid))}${pubDate ? tag("pubDate", pubDate) : ""}${author ? tag("author", author) : ""}<description><![CDATA[${cdata(simplify(html))}]]></description><content:encoded><![CDATA[${cdata(html)}]]></content:encoded>${enclosureXml}</item>`;
  });
  const title = repairMojibake(text(channel.title));
  const description = repairMojibake(text(channel.description));
  const link = repairMojibake(text(channel.link));
  const atom = selfUrl ? `<atom:link href="${esc(selfUrl)}" rel="self" type="application/rss+xml"/>` : "";
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>${tag("title", title)}${tag("link", link)}${tag("description", description)}${atom}${items.join("")}</channel></rss>`;
  return { xml, diagnostic: { feedDetected: true, itemsFound: items.length, encodingIssuesDetected: sourceHadIssues, contentEncodedGenerated: items.length > 0, imagesFound, warnings: rawItems.length ? [] : ["Feed has no items"] } };
}
