import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const engineDir = join(currentDir, "engine");

const forbiddenImportPatterns = [
    /\bfrom\s+["']react["']/,
    /\bimport\s+["']react["']/,
    /\bfrom\s+["'][^"']+\.tsx["']/,
    /\bfrom\s+["'][^"']*SvgVectorRenderer["']/,
    /\bfrom\s+["'][^"']*SvgVectorDocumentRenderer["']/,
];

const publicUiEngineImportPattern = /\bfrom\s+["']\.\/engine(?:\/index)?["']/;
const internalUiEngineImportPattern = /\bfrom\s+["']\.\/engine\/(?!index["'])[^"']+["']/;

const getTsFiles = (directory: string): string[] =>
    readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = join(directory, entry.name);

        if (entry.isDirectory()) {
            return getTsFiles(fullPath);
        }

        return entry.name.endsWith(".ts") ? [fullPath] : [];
    });

test("pure flange drawing engine files do not import React or React renderers", () => {
    const pureEngineFiles = getTsFiles(engineDir);

    assert.ok(pureEngineFiles.some((filePath) => filePath.endsWith("flangeDrawingEngine.ts")));

    for (const filePath of pureEngineFiles) {
        const source = readFileSync(filePath, "utf8");

        for (const pattern of forbiddenImportPatterns) {
            assert.equal(
                pattern.test(source),
                false,
                `${filePath} should not match forbidden import pattern ${pattern}`
            );
        }
    }
});

test("non-test flange UI files import the engine through the public barrel", () => {
    const uiFiles = readdirSync(currentDir).filter((fileName) =>
        (fileName.endsWith(".ts") || fileName.endsWith(".tsx")) &&
        !fileName.endsWith(".test.ts") &&
        !fileName.endsWith(".test.tsx")
    );

    for (const fileName of uiFiles) {
        const source = readFileSync(join(currentDir, fileName), "utf8");

        assert.equal(
            internalUiEngineImportPattern.test(source),
            false,
            `${fileName} should import public engine API from "./engine", not engine internals`
        );

        if (source.includes("./engine")) {
            assert.equal(
                publicUiEngineImportPattern.test(source),
                true,
                `${fileName} should use the public engine barrel`
            );
        }
    }
});
