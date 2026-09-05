import { readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = process.cwd();
const cssFiles = [
  "client/src/index.css",
  "client/src/styles/scroll-animations.css",
];
const sourceRoots = ["client/src", "client/index.html", "server", "shared"];
const outputPath = "reports/css-selector-reference-audit.json";
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".html"]);

async function filesFor(path) {
  const absolute = join(root, path);
  const stat = await (await import("node:fs/promises")).stat(absolute);
  if (stat.isFile()) return [absolute];
  const entries = await readdir(absolute, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const next = join(absolute, entry.name);
    if (entry.isDirectory()) return filesFor(relative(root, next));
    return sourceExtensions.has(next.slice(next.lastIndexOf("."))) ? [next] : [];
  }));
  return nested.flat();
}

const sourceFiles = (await Promise.all(sourceRoots.map(filesFor))).flat();
const sourceTexts = await Promise.all(sourceFiles.map(async file => ({
  file: relative(root, file),
  text: await readFile(file, "utf8"),
})));

const report = { generatedAt: new Date().toISOString(), cssFiles: [] };
for (const cssFile of cssFiles) {
  const css = await readFile(join(root, cssFile), "utf8");
  const selectors = new Set([...css.matchAll(/\.([_a-zA-Z][-_a-zA-Z0-9]*)/g)].map(match => match[1]));
  const classes = [...selectors].sort().map(selector => {
    const word = new RegExp(`(^|[^-_a-zA-Z0-9])${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?=$|[^-_a-zA-Z0-9])`, "g");
    const references = sourceTexts
      .filter(({ text }) => word.test(text))
      .map(({ file }) => file);
    return { selector, references };
  });
  report.cssFiles.push({
    file: cssFile,
    selectorCount: classes.length,
    sourceReferenced: classes.filter(item => item.references.length > 0).length,
    sourceUnreferenced: classes.filter(item => item.references.length === 0).map(item => item.selector),
  });
}

await writeFile(join(root, outputPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
