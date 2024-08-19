import Terser from "terser-webpack-plugin";
import path from "path";
import URL from "url";
import fs from "fs";
import crypto from "crypto";
import uglify from "uglify-js";
import js_beautify from "js-beautify";

const ignoreFiles = [
    "moddingAPI/index.js",
    "moddingAPI/highlight.mins.js"
];

const config = {
    optimization: {
        minimize: true,
        minimizer: [
            new Terser({
                parallel: true,
                terserOptions: {
                    mangle: true,
                    ecma: 5
                }
            })
        ]
    },
    entry: {
        bundle: "./public/index.js",  // Main bundle entry point
        worker: "./public/server/index.js"  // Worker entry point
    },
    output: {
        path: path.resolve(path.dirname(URL.fileURLToPath(import.meta.url)), "./build"),
        filename: "[name].js"
    },
    plugins: [{
        apply: (compiler) => {
            compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
                console.log("Copying and processing files...");
                const sourceDir = path.resolve(
                    path.dirname(URL.fileURLToPath(import.meta.url)),
                    "./public"
                );

                const destinationDir = compiler.outputPath;

                // Clear the destination directory of all subdirectories (recursively) but leave the files intact
                fs.readdirSync(destinationDir).forEach((file) => {
                    if (fs.statSync(path.join(destinationDir, file)).isDirectory()) {
                        fs.rmSync(path.join(destinationDir, file), { recursive: true });
                    }
                });

                // Define a function to recursively copy and process files
                function copyAndProcessFiles(srcDir, destDir) {
                    const files = fs.readdirSync(srcDir);

                    files.forEach((file) => {
                        const sourcePath = path.join(srcDir, file);
                        const destPath = path.join(destDir, file);

                        if (fs.statSync(sourcePath).isDirectory()) {
                            // Recursively copy and process subdirectories
                            fs.mkdirSync(destPath);
                            copyAndProcessFiles(sourcePath, destPath);
                        } else if (path.extname(file) === ".js") {
                            if (ignoreFiles.some(f => sourcePath.replace(/\\/g, "/").includes(f))) {
                                console.log("Ignoring", sourcePath);
                                fs.copyFileSync(sourcePath, destPath.replace("index.js", "bundle.js"));
                            }
                        } else if (path.extname(file) === ".html" || path.extname(file) === ".css") {
                            // If it's an HTML or CSS file, minimize it and then copy
                            const content = fs.readFileSync(sourcePath, "utf8");
                            fs.writeFileSync(destPath, content.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/\s+/g, " ").replace(/<!--.*?-->/g, "").replace("index.js", "bundle.js"), "utf8");
                        } else {
                            // Copy other files as is
                            fs.copyFileSync(sourcePath, destPath);
                        }
                    });
                }

                // Start copying and processing files from the source directory
                copyAndProcessFiles(sourceDir, destinationDir);

                function recursiveRemoveEmptyDirectories(directory) {
                    // If it doesn't exist, return
                    if (!fs.existsSync(directory)) {
                        return;
                    }

                    if (fs.statSync(directory).isDirectory()) {
                        const files = fs.readdirSync(directory);

                        if (files.length === 0) {
                            fs.rmdirSync(directory);
                            recursiveRemoveEmptyDirectories(path.dirname(directory));
                        } else {
                            files.forEach((file) => {
                                recursiveRemoveEmptyDirectories(path.join(directory, file));
                            });
                        }
                    }
                }

                // Remove empty directories from the destination directory
                recursiveRemoveEmptyDirectories(destinationDir);

                // Generate a hash of the build
                const hash = crypto.createHash("sha256");
                function recursiveHashFiles(directory) {
                    const files = fs.readdirSync(directory);

                    files.forEach((file) => {
                        const filePath = path.join(directory, file);

                        if (fs.statSync(filePath).isDirectory()) {
                            recursiveHashFiles(filePath);
                        } else {
                            hash.update(fs.readFileSync(filePath));
                        }
                    });
                }

                recursiveHashFiles(destinationDir);

                const buildHash = hash.digest("hex");

                // Write the hash to a file
                fs.writeFileSync(path.join(destinationDir, "version.txt"), buildHash);
            });
        }
    }, { // Post processing plugin
        apply: (compiler) => {
            compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
                // Find worker.js and move it to /server/index.js
                const workerPath = path.join(compiler.outputPath, "worker.js");
                fs.mkdirSync(path.join(compiler.outputPath, "server"), { recursive: true });
                fs.renameSync(workerPath, path.join(compiler.outputPath, "server", "index.js"));

                // Make a copy and append a comment to the start of it
                let serverCode = fs.readFileSync(path.join(compiler.outputPath, "server", "index.js"), "utf8");
                serverCode = js_beautify.js_beautify(uglify.minify(`/* Polyfills and supporting code for bun's runtime */
globalThis.environmentName = "bun";
const location = {
    href: "https://floof.eparker.dev/server/bun.js"
};
const _fetch = fetch;
fetch = async (...args) => {
    args[0] = "https://floof.eparker.dev" + args[0];
    const response = await _fetch(...args); 
    const text = await response.text();
    return {
        text: async () => text,
        json: async () => JSON.parse(text)
    };
};

${serverCode}`.trim(), {
    compress: true,
    mangle: false
}).code);

                fs.writeFileSync(path.join(compiler.outputPath, "server", "bun.js"), serverCode);
            });
        }
    }],
    resolve: {
        extensions: [".js", ".html"]
    },
    mode: "production"
};

export default config;
