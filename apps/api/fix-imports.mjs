import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(scriptDir, "src");

// Extensions that should already be present in runtime imports.
const runtimeExtensions = [".js", ".mjs", ".cjs", ".json", ".node"];

let updatedFiles = 0;
let updatedImports = 0;

function shouldUpdate(specifier) {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
    return false;
  }

  return !runtimeExtensions.some((ext) => specifier.endsWith(ext));
}

function resolveAlias(specifier, importer) {
  if (!specifier.startsWith("@/")) return specifier;

  const target = path.resolve(root, specifier.slice(2));
  let relative = path.relative(path.dirname(importer), target);

  relative = relative.split(path.sep).join("/");

  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }

  return relative + ".js";
}

function processFile(filePath) {
  const source = fs.readFileSync(filePath, "utf8");

  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
  );

  const replacements = [];

  function checkModuleSpecifier(node) {
    if (!node || !ts.isStringLiteralLike(node)) return;

    const specifier = node.text;

    let updated;

    if (specifier.startsWith("@/")) {
      updated = resolveAlias(specifier, filePath);
    } else if (shouldUpdate(specifier)) {
      updated = specifier + ".js";
    } else {
      return;
    }

    replacements.push({
      start: node.getStart(sourceFile) + 1,
      end: node.getEnd() - 1,
      value: updated,
    });
  }

  function visit(node) {
    if (ts.isImportDeclaration(node)) {
      checkModuleSpecifier(node.moduleSpecifier);
    }

    if (ts.isExportDeclaration(node)) {
      checkModuleSpecifier(node.moduleSpecifier);
    }

    if (
      ts.isCallExpression(node) &&
      node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
      checkModuleSpecifier(node.arguments[0]);
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  if (replacements.length === 0) return;

  // Apply replacements backwards to preserve source positions.
  replacements.sort((a, b) => b.start - a.start);

  let result = source;

  for (const replacement of replacements) {
    result =
      result.slice(0, replacement.start) +
      replacement.value +
      result.slice(replacement.end);

    updatedImports++;
  }

  fs.writeFileSync(filePath, result);
  updatedFiles++;

  console.log(`Updated: ${path.relative(root, filePath)}`);
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true,
  })) {
    const filePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(filePath);
      continue;
    }

    if (!/\.(ts|tsx|mts|cts)$/.test(entry.name)) continue;
    if (entry.name.endsWith(".d.ts")) continue;

    processFile(filePath);
  }
}

if (!fs.existsSync(root)) {
  throw new Error(`Source directory not found: ${root}`);
}

walk(root);

console.log("\nMigration completed.");
console.log(`Files updated: ${updatedFiles}`);
console.log(`Imports updated: ${updatedImports}`);
