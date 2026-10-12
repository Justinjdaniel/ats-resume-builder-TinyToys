import assert from "node:assert/strict";
import { after, test } from "node:test";
import {
  extractTextFromFile,
  parseMultipleFilesToMasterData,
} from "./fileParser";
import { DEFAULT_PROFILE } from "./storage";

const originalFileReader = globalThis.FileReader;

class TextFileReader {
  result: string | ArrayBuffer | null = null;
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  onerror: ((event: ProgressEvent<FileReader>) => void) | null = null;

  readAsText(_file: Blob) {
    this.result = "Taylor Example\ntaylor@example.com";
    this.onload?.({ target: this } as unknown as ProgressEvent<FileReader>);
  }
}

globalThis.FileReader = TextFileReader as unknown as typeof FileReader;

after(() => {
  globalThis.FileReader = originalFileReader;
});

test("reads a supported text resume", async () => {
  const text = await extractTextFromFile(new File(["resume"], "resume.txt"));

  assert.equal(text, "Taylor Example\ntaylor@example.com");
});

test("reports unsupported binary files in multi-file results", async () => {
  const { fileDetails } = await parseMultipleFilesToMasterData(
    [new File(["pdf bytes"], "resume.pdf")],
    DEFAULT_PROFILE,
  );

  assert.equal(fileDetails.length, 1);
  assert.equal(fileDetails[0].name, "resume.pdf");
  assert.match(fileDetails[0].error ?? "", /not supported locally/);
});
