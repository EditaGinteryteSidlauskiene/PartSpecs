import { readFile } from "node:fs/promises";
import ts from "typescript";

const resolveExtensions = [".ts", ".tsx"];

export async function resolve(specifier, context, defaultResolve) {
    try {
        return await defaultResolve(specifier, context, defaultResolve);
    } catch (error) {
        if (error?.code !== "ERR_MODULE_NOT_FOUND" || !specifier.startsWith(".")) {
            throw error;
        }

        for (const extension of resolveExtensions) {
            const resolvedUrl = new URL(`${specifier}${extension}`, context.parentURL);

            try {
                await readFile(resolvedUrl);
                return {
                    shortCircuit: true,
                    url: resolvedUrl.href,
                };
            } catch {
                // Try the next extension.
            }
        }

        throw error;
    }
}

export async function load(url, context, defaultLoad) {
    if (!url.endsWith(".ts") && !url.endsWith(".tsx")) {
        return defaultLoad(url, context, defaultLoad);
    }

    const source = await readFile(new URL(url), "utf8");
    const transpiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2023,
            jsx: ts.JsxEmit.ReactJSX,
            allowImportingTsExtensions: true,
            verbatimModuleSyntax: true,
        },
    });

    return {
        format: "module",
        shortCircuit: true,
        source: transpiled.outputText,
    };
}
