import { describe, expect, it } from "vitest";
import { hasEncodingIssues, repairMojibake } from "../lib/encoding";

describe("repairMojibake", () => {
  it("repairs UTF-8 decoded as Windows-1252", () => {
    expect(repairMojibake("Engajamento nÃ£o Ã© retenÃ§Ã£o â€” â€œvalorâ€")).toBe("Engajamento não é retenção — “valor”");
  });
  it("does not alter valid Unicode", () => {
    expect(repairMojibake("Educação, ação e valor — já correto ✓")).toBe("Educação, ação e valor — já correto ✓");
  });
  it("reports suspicious text", () => {
    expect(hasEncodingIssues("nÃ£o")).toBe(true);
    expect(hasEncodingIssues("não")).toBe(false);
  });
});
