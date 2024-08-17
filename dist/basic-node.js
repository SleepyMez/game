import { Worker } from "node:worker_threads";
import { WebSocket } from "ws";

const options = {
    source: "https://floof.eparker.dev/server/index.js",
    host: "wss://floof-router.glitch.me",
    gameName: "z46",
    modded: false,
    gamemode: "maze",
    secret: "staging_key",
    biome: Math.random() * 7 | 0,
    private: false
};

const src = options.source;
const response = await fetch(src);
let code = await response.text();

if (!code.startsWith("/* FLOOF NODE SUPPORT */")) {
    // Add src to it
    code = `
        /* FLOOF NODE SUPPORT */        
        (async () => {
            const { parentPort } = await import("worker_threads");
        
            self = {
                onmessage: null,
                postMessage: data => parentPort.postMessage(data),
                environmentName: "node"
            };

            parentPort.on("message", data => {
                if (self.onmessage) {
                    self.onmessage({ data });
                }
            });

            const location = {
                href: "${src}"
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

            const _setInterval = setInterval;
            setInterval = (callback, delay, ...args) => {
                let lastCall = performance.now();

                const interval = _setInterval(() => {
                    const now = performance.now();

                    if (now - lastCall >= delay) {
                        callback(...args);
                        lastCall = now;
                    }
                }, Math.max(1, delay * .1));
            };

            ${code}
        })();`;
}

const socket = new WebSocket(`${options.host}/ws/lobby?gameName=${options.gameName}&isModded=${options.modded ? "yes" : "no"}&gamemode=${options.gamemode}&secret=${options.secret}&isPrivate=${options.private ? "yes" : "no"}&biome=${options.biome}`, {
    origin: "https://floof.eparker.dev",
    headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
    }
});

socket.binaryType = "arraybuffer";

socket.onopen = () => {
    console.log("Connected to server");

    const worker = new Worker(code, {
        eval: true
    });

    worker.postMessage(["start", options.gamemode, options.modded, crypto.randomUUID(), options.biome]);

    socket.onmessage = event => {
        const data = new Uint8Array(event.data);

        if (data[0] === 255) {
            const ok = data[1] === 1;

            if (!ok) {
                throw new Error("Request rejected by server");
            }

            console.log("Lobby Verified", new TextDecoder().decode(data.slice(2, -1)));
            return;
        }

        worker.postMessage(data);
    }

    worker.addListener("message", data => {
        if (socket.readyState !== WebSocket.OPEN) {
            return;
        }

        socket.send(data);
    });

    socket.onclose = () => {
        console.log("Disconnected from server");
        worker.terminate();
    }
}