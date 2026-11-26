/**
 * One-Liner Laughs — make.fun bounty entry.
 *
 * A single funny line (at most 200 characters) written to /output/entry.txt.
 * Node 22, standard library only, deterministic, no network and no input.
 * The joke itself is the ENTRY constant below; everything else is the
 * gate that proves it is exactly one line inside the limit, plus a
 * read-back check that the file on disk matches it byte for byte.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I asked my fridge for life advice. It said 'chill' — useless, yet technically its entire job description.";

const OUT_DIR = "/output";
const OUT_PATH = join(OUT_DIR, "entry.txt");
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  throw new Error(`One-Liner Laughs entry rejected: ${message}`);
}

function checkEntry(text: string): void {
  if (text.length < MIN_CHARS || text.length > MAX_CHARS) {
    fail(`length must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    fail("entry must not be only white space");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be exactly one line (no newline characters)");
  }
  if (text !== text.trim()) {
    fail("entry must not start or end with white space");
  }
  if (text.includes("  ")) {
    fail("entry must not contain double spaces");
  }
}

checkEntry(ENTRY);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_PATH, ENTRY, "utf8");

const backAsText = readFileSync(OUT_PATH, "utf8");
if (backAsText !== ENTRY) {
  fail(`read-back text mismatch: expected ${JSON.stringify(ENTRY)}, got ${JSON.stringify(backAsText)}`);
}

const backAsBytes = readFileSync(OUT_PATH);
if (!backAsBytes.equals(Buffer.from(ENTRY, "utf8"))) {
  fail(`read-back byte mismatch: expected ${Buffer.byteLength(ENTRY, "utf8")} bytes, got ${backAsBytes.length}`);
}

console.log(
  `Wrote ${ENTRY.length} characters (${Buffer.byteLength(ENTRY, "utf8")} UTF-8 bytes) to ${OUT_PATH}`,
);
