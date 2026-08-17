const SUSPICIOUS = /(?:Ã.|Â.|â[€-™]|ðŸ|ï¿½|\uFFFD)/g;

function score(value: string): number {
  return (value.match(SUSPICIOUS) ?? []).length * 3 + (value.match(/\uFFFD/g) ?? []).length * 5;
}

function windows1252Bytes(value: string): Uint8Array | null {
  const reverse = new Map<number, number>();
  for (let byte = 0; byte < 256; byte++) {
    const char = new TextDecoder("windows-1252").decode(Uint8Array.of(byte));
    reverse.set(char.codePointAt(0)!, byte);
  }
  const bytes: number[] = [];
  for (const char of value) {
    const byte = reverse.get(char.codePointAt(0)!);
    if (byte === undefined) return null;
    bytes.push(byte);
  }
  return Uint8Array.from(bytes);
}

export function repairMojibake(value: string): string {
  let best = value;
  for (let pass = 0; pass < 2; pass++) {
    const bytes = windows1252Bytes(best);
    if (!bytes) break;
    let candidate: string;
    try { candidate = new TextDecoder("utf-8", { fatal: true }).decode(bytes); }
    catch { break; }
    if (score(candidate) >= score(best)) break;
    best = candidate;
  }
  return best;
}

export function hasEncodingIssues(value: string): boolean {
  return score(value) > 0;
}
