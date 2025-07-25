#!/usr/bin/node
/*
 * Vencord, a modification for Discord's desktop app
 * Copyright (c) 2022 Vendicated and contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

// @ts-check

import { createPackage } from "@electron/asar";
import { readdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { BUILD_TIMESTAMP, commonOpts, exists, globPlugins, IS_DEV, IS_REPORTER, IS_COMPANION_TEST, IS_STANDALONE, IS_UPDATER_DISABLED, resolvePluginName, VERSION, commonRendererPlugins, watch, buildOrWatchAll, stringifyValues } from "./common.mjs";

const defines = stringifyValues({
    IS_STANDALONE,
    IS_DEV,
    IS_REPORTER,
    IS_COMPANION_TEST,
    IS_UPDATER_DISABLED,
    IS_WEB: false,
    IS_EXTENSION: false,
    IS_USERSCRIPT: false,
    VERSION,
    BUILD_TIMESTAMP
});

if (defines.IS_STANDALONE === "false") {
    // If this is a local build (not standalone), optimize
    // for the specific platform we're on
    defines["process.platform"] = JSON.stringify(process.platform);
}

/**
 * @type {import("esbuild").BuildOptions}
 */
const nodeCommonOpts = {
    ...commonOpts,
    define: defines,
    format: "cjs",
    platform: "node",
    target: ["esnext"],
    // @ts-expect-error this is never undefined
    external: ["electron", "original-fs", "~pluginNatives", ...commonOpts.external]
};

const sourceMapFooter = s => watch ? "" : `//# sourceMappingURL=vencord://${s}.js.map`;
const sourcemap = watch ? "inline" : "external";

/**
 * @type {import("esbuild").Plugin}
 */
const globNativesPlugin = {
    name: "glob-natives-plugin",
    setup: build => {
        const filter = /^~pluginNatives$/;
        build.onResolve({ filter }, args => {
            return {
                namespace: "import-natives",
                path: args.path
            };
        });

        build.onLoad({ filter, namespace: "import-natives" }, async () => {
            const pluginDirs = ["plugins", "userplugins", "equicordplugins", "chyzcordplugins"];
            let code = "";
            let natives = "\n";
            let i = 0;
            for (const dir of pluginDirs) {
                const dirPath = join("src", dir);
                if (!await exists(dirPath)) continue;
                const plugins = await readdir(dirPath, { withFileTypes: true });
                for (const file of plugins) {
                    const fileName = file.name;
                    const nativePath = join(dirPath, fileName, "native.ts");
                    const indexNativePath = join(dirPath, fileName, "native/index.ts");

                    if (!(await exists(nativePath)) && !(await exists(indexNativePath)))
                        continue;

                    const pluginName = await resolvePluginName(dirPath, file);

                    const mod = `p${i}`;
                    code += `import * as ${mod} from "./${dir}/${fileName}/native";\n`;
                    natives += `${JSON.stringify(pluginName)}:${mod},\n`;
                    i++;
                }
            }
            code += `export default {${natives}};`;
            return {
                contents: code,
                resolveDir: "./src"
            };
        });
    }
};

/** @type {import("esbuild").BuildOptions[]} */
const buildConfigs = ([
    // Discord Desktop main & renderer & preload
    {
        ...nodeCommonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/main/index.ts")],
        outfile: "dist/desktop/patcher.js",
        footer: { js: "//# sourceURL=file:///VencordPatcher\n" + sourceMapFooter("patcher") },
        sourcemap,
        plugins: [
            // @ts-ignore this is never undefined
            ...nodeCommonOpts.plugins,
            globNativesPlugin
        ],
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "true",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "false"
        }
    },
    {
        ...commonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/Vencord.ts")],
        outfile: "dist/desktop/renderer.js",
        format: "iife",
        target: ["esnext"],
        footer: { js: "//# sourceURL=file:///VencordRenderer\n" + sourceMapFooter("renderer") },
        globalName: "Vencord",
        sourcemap,
        plugins: [
            globPlugins("discordDesktop"),
            ...commonOpts.plugins
        ],
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "true",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "false"
        }
    },
    {
        ...nodeCommonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/preload.ts")],
        outfile: "dist/desktop/preload.js",
        footer: { js: "//# sourceURL=file:///VencordPreload\n" + sourceMapFooter("preload") },
        sourcemap,
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "true",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "false"
        }
    },

    // Vencord Desktop main & renderer & preload
    {
        ...nodeCommonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/main/index.ts")],
        outfile: "dist/equibop/main.js",
        footer: { js: "//# sourceURL=file:///VencordDesktopMain\n" + sourceMapFooter("main") },
        sourcemap,
        plugins: [
            ...nodeCommonOpts.plugins,
            globNativesPlugin
        ],
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "false",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "true"
        }
    },
    {
        ...commonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/Vencord.ts")],
        outfile: "dist/equibop/renderer.js",
        format: "iife",
        target: ["esnext"],
        footer: { js: "//# sourceURL=file:///VencordDesktopRenderer\n" + sourceMapFooter("renderer") },
        globalName: "Vencord",
        sourcemap,
        plugins: [
            globPlugins("equibop"),
            ...commonRendererPlugins
        ],
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "false",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "true"
        }
    },
    {
        ...nodeCommonOpts,
        entryPoints: [join(dirname(fileURLToPath(import.meta.url)), "../../src/preload.ts")],
        outfile: "dist/equibop/preload.js",
        footer: { js: "//# sourceURL=file:///VencordPreload\n" + sourceMapFooter("preload") },
        sourcemap,
        define: {
            ...defines,
            IS_DISCORD_DESKTOP: "false",
            IS_VESKTOP: "false",
            IS_EQUIBOP: "true"
        }
    }
]);

await buildOrWatchAll(buildConfigs);

await Promise.all([
    writeFile("dist/desktop/package.json", JSON.stringify({
        name: "equicord",
        main: "patcher.js"
    })),
    writeFile("dist/equibop/package.json", JSON.stringify({
        name: "equicord",
        main: "main.js"
    }))
]);

await Promise.all([
    createPackage("dist/desktop", "dist/desktop.asar"),
    createPackage("dist/equibop", "dist/equibop.asar"),
]);
