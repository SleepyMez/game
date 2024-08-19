import state from "./lib/state.js";
import { BIOME_TYPES, CLIENT_BOUND, Drawing, encodeEverything, ENTITY_TYPES, GAMEMODES, PetalTier } from "../lib/protocol.js";
import { DEFAULT_PETAL_COUNT, mobConfigs, PetalConfig, petalConfigs, tiers } from "./lib/config.js";
import { AIPlayer, Mob, Player } from "./lib/Entity.js";
import Router from "./lib/Router.js";
import { stringToU8 } from "../lib/lobbyProtocol.js";

function createWave(n) {
    const output = [];

    if (state.mobTable?.length > 0) {
        for (let i = 0; i < n; i++) {
            output.push(state.mobTable[Math.random() * state.mobTable.length | 0]);
        }

        return output;
    }

    let hasHole = false,
        demons = 0,
        aiPlayers = 0;

    for (let i = 0; i < n; i++) {
        while (true) {
            if (Math.random() > .975 && aiPlayers < 3) {
                aiPlayers++;
                output.push(-1);
                break;
            }

            const index = Math.random() * mobConfigs.length | 0;
            const name = mobConfigs[index].name.toLowerCase();

            if (mobConfigs[index].isSystem) {
                continue;
            }

            if (mobConfigs[index].tiers[0].antHoleSpawns?.length > 0) {
                if (hasHole) {
                    continue;
                }

                hasHole = true;
            } else if (name.includes("ant") || name.includes("termite") || name.includes("system")) {
                continue;
            }

            if (name.includes("queen") && name.includes("egg")) {
                continue;
            }

            if (name.includes("shiny") || name.includes("angelic")) {
                if (Math.random() > .01) {
                    continue;
                }
            }

            if (name.includes("demon")) {
                if (demons >= n * .125) {
                    continue;
                }

                demons++;
            }

            output.push(index);
            break;
        }
    }

    return output;
}

function getMobIndex() {
    if (state.mobTable?.length > 0) {
        return state.mobTable[Math.random() * state.mobTable.length | 0];
    }

    let k = 0;

    while (k++ < 100) {
        const index = Math.random() * mobConfigs.length | 0;
        const name = mobConfigs[index].name.toLowerCase();

        if (mobConfigs[index].tiers[0].antHoleSpawns?.length > 0 && Math.random() > .9) {
            return index;
        }

        if ((name.includes("ant") || name.includes("termite")) && Math.random() > .2) {
            continue;
        }

        if (name.includes("demon") && Math.random() > .995) {
            return index;
        }

        if (mobConfigs[index].isSystem) {
            continue;
        }

        return index;
    }

    return 0;
}

// Game loop
setInterval(() => {
    const startTime = performance.now();

    state.spatialHash.clear();
    state.viewsSpatialHash.clear();

    state.entities.forEach(entity => {
        entity.update();
    });

    state.entities.forEach(entity => {
        if (entity._AABB) {
            entity.collide();
        }
    });

    switch (state.gamemode) {
        case GAMEMODES.FFA:
        case GAMEMODES.TDM: {
            const oldMapSize = state.width;
            const newMapSize = 32 * 32 + 32 * 8 * (state.clients.size - 1);

            if (oldMapSize !== newMapSize) {
                state.width = state.height = newMapSize;
                state.maxMobs = 10 + 2 * (state.clients.size - 1);

                state.clients.forEach(client => client.sendRoom());
            }
        } break;
        case GAMEMODES.WAVES: {
            if (state.isWaves && state.livingMobCount === 0) {
                state.currentWave++;
                state.maxMobs = Math.min(64, 6 + 2 * state.currentWave);
                state.width = state.height = Math.min(32 * 32 + 32 * 2 * state.currentWave, Math.pow(128, 2));

                state.clients.forEach(client => client.sendRoom());
                const mobIndexes = createWave(state.maxMobs);

                for (let i = 0; i < state.maxMobs; i++) {
                    if (mobIndexes[i] === -1) {
                        new AIPlayer(
                            state.random(),
                            Math.max(0, Math.min(Math.min(11, Math.floor(Math.pow(state.currentWave, .475))) - (Math.random() * 3 | 0), 10)),
                            state.currentWave
                        );
                        continue;
                    }

                    const mob = new Mob(state.random());
                    mob.define(mobConfigs[mobIndexes[i]], Math.max(0, Math.min(Math.min(11, Math.floor(Math.pow(state.currentWave, .475))) - (Math.random() * 3 | 0), 10)));
                }
            }
        } break;
        case GAMEMODES.LINE: {
            const oldW = state.width;
            const oldH = state.height;

            state.width = 32 * 32 * 16;
            state.height = 32 * 32 * 4;
            state.maxMobs = 10 + 2 * (state.clients.size - 1);

            if (oldW !== state.width || oldH !== state.height) {
                state.clients.forEach(client => client.sendRoom());
            }
        } break;
        case GAMEMODES.MAZE:
            state.maxMobs = state.biome === BIOME_TYPES.ANT_HELL ? (32 + 12 * state.clients.size) : (24 + 6 * state.clients.size);
            break;
    }

    if (!state.isWaves && state.livingMobCount < state.maxMobs && Math.random() > .9) {
        if (state.gamemode === GAMEMODES.MAZE) {
            const cfg = mobConfigs[getMobIndex()];
            const info = state.spawnNearPlayer(cfg);
            const mob = new Mob(info.position);
            mob.define(cfg, info.rarity);
        } else if (state.isLineMap) {
            const cfg = mobConfigs[getMobIndex()];
            const info = state.lineMapMobSpawn(cfg);
            const mob = new Mob(info.position);
            mob.define(cfg, info.rarity);
        } else {
            const mob = new Mob(state.random());
            mob.define(mobConfigs[getMobIndex()], Mob.TEMPORARY_RANDOM_RARITY());
        }
    }

    state.lag.totalTime += performance.now() - startTime;
    state.lag.ticks++;
}, 1000 / 22.5);

let k = 0;
setInterval(() => {
    state.lag.mspt = state.lag.totalTime / Math.max(1, state.lag.ticks);
    state.lag.fps = state.lag.ticks;

    state.lag.totalTime = 0;
    state.lag.ticks = 0;

    // CHANGE THIS
    if (!Router.isSandbox && ++k % 5 === 0) {
        console.log("FPS:", state.lag.fps, "MSPT:", state.lag.mspt.toFixed(2));
    }
}, 1000);

// Drops update
setInterval(() => {
    state.drops.forEach(d => d.update());
    state.lightning.forEach(l => l.update());
}, 256);

// World update loop
setInterval(() => state.clients.forEach(c => c.worldUpdate()), 1000 / 20);

// Router server through worker through socket
state.router = new Router();

switch (globalThis.environmentName) {
    case "browser":
        self.onmessage = async ({ data }) => {
            switch (data[0]) {
                case 0x00:
                    state.router.addClient(Router.u8ToU16(data, 1), Router.getText(data, 4, data.length - 4), data[3]);
                    break;
                case 0x01:
                    state.router.pipeMessage(Router.u8ToU16(data, 1), new DataView(data.buffer, data.byteOffset + 3, data.byteLength - 3));
                    break;
                case 0x02:
                    state.router.removeClient(Router.u8ToU16(data, 1));
                    break;
                case "start":
                    state.router.begin(data);

                    if (data[2]) {
                        new ModdingAPI();
                    }
                    break;
            }
        }

        state.router.postMessage = data => self.postMessage(data);
        break;
    case "node":
        throw new Error("Node environment not supported");
    case "bun": {
        let bunSocketID = 1;
        const bunSendMap = new Map();
        const server = Bun.serve({
            fetch(req) {
                const success = server.upgrade(req, {
                    data: {
                        socketID: bunSocketID++,
                        searchParams: new URLSearchParams(req.url.split("?").slice(1).join("?"))
                    }
                });

                if (success) {
                    return undefined;
                }

                return new Response("Hello world");
            },

            websocket: {
                open(socket) {
                    socket.binaryType = "arraybuffer";
                    state.router.addClient(socket.data.bunSocketID, socket.data.searchParams.get("uuid"), false);
                    bunSendMap.set(socket.data.bunSocketID, socket);
                },

                close(socket) {
                    state.router.removeClient(socket.data.bunSocketID);
                    bunSendMap.delete(socket.data.bunSocketID);
                },

                message(socket, data) {
                    if (typeof data === "string") {
                        return;
                    }

                    state.router.pipeMessage(socket.data.bunSocketID, new DataView(data));
                }
            },

            port: 8080
        });

        const options = {
            host: "ws://localhost",
            gameName: "bun",
            modded: false,
            gamemode: "waves",
            secret: "staging_key",
            biome: Math.random() * 7 | 0,
            private: false
        };

        const socket = new WebSocket(`${options.host}/ws/lobby?gameName=${options.gameName}&isModded=${options.modded ? "yes" : "no"}&gamemode=${options.gamemode}&secret=${options.secret}&isPrivate=${options.private ? "yes" : "no"}&biome=${options.biome}&directConnect=unsecure`, {
            origin: "https://floof.eparker.dev",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36"
            }
        });

        socket.binaryType = "arraybuffer";

        socket.onopen = () => {
            console.log("Connected to server");

            state.router.begin(["start", options.gamemode, options.modded, crypto.randomUUID(), options.biome]);

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

                console.log("Received:", data);
            }

            state.router.postMessage = u8 => {
                console.log("Sending", u8);
                socket.send(u8);
            }

            socket.onclose = () => {
                console.log("Disconnected from server");
            }
        }
    } break;
    default:
        throw new Error("Invalid environment");
}

let hasDoneItBefore = false;
function sendMockups() {
    self.postMessage(new Uint8Array([0x02, ...stringToU8(JSON.stringify(encodeEverything(tiers, petalConfigs, mobConfigs)))]));

    if (hasDoneItBefore) {
        setTimeout(() => state.clients.forEach(c => c.talk(CLIENT_BOUND.UPDATE_ASSETS)), 250);
    }

    hasDoneItBefore = true;
}

sendMockups();

class ModdingAPI {
    static TRANSFERRABLE_TYPES = {
        PetalConfig: 0,
        MobConfig: 1
    };

    static assignTransferrableType(obj, type) {
        let output;

        switch (type) {
            case ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig:
                output = Object.assign(new PetalConfig("", 0, 0, 0), structuredClone(obj));

                for (const key in obj) {
                    const value = structuredClone(obj[key]);

                    switch (key) {
                        case "drawing":
                            output.drawing = Object.assign(new Drawing(), value);
                            break;
                        case "tiers":
                            for (let i = 0; i < value.length; i++) {
                                output.tiers[i] = Object.assign(new PetalTier(0, 0, 0), value[i]);
                            }
                    }
                }
                break;
        }

        return output;
    }

    /** @type {BroadcastChannel|null} */
    #channel = null;

    constructor() {
        this.#channel = new BroadcastChannel("floofModdingAPI");
        this.#channel.onmessage = e => this.parseModdingAPICommand(e.data);
    }

    floofModdingResponse(jobID, ok, message, data = null, transferrableType = null) {
        this.#channel.postMessage([jobID, {
            ok: ok,
            message: message,
            data: data
        }, transferrableType]);
    }

    validateArg(jobID, name, arg, type, minMax) {
        if (typeof arg !== type) {
            this.floofModdingResponse(jobID, false, `Argument ${name} must be of type ${type}`);
            return false;
        }

        if (minMax) {
            if (arg < minMax[0] || arg > minMax[1]) {
                this.floofModdingResponse(jobID, false, `Argument ${name} must be between ${minMax[0]} and ${minMax[1]}`);
                return false;
            }
        }

        return true;
    }

    parseModdingAPICommand(data) {
        const [jobID, functionName, ...args] = data;

        switch (functionName) {
            case "spawnMob": {
                if (args.length !== 2) {
                    this.floofModdingResponse(jobID, false, "spawnMob(index, rarity) requires 2 arguments!");
                    return;
                }

                if (!this.validateArg(jobID, "index", args[0], "number", [0, mobConfigs.length - 1]) || !this.validateArg(jobID, "rarity", args[1], "number", [0, tiers.length - 1])) {
                    return;
                }

                const mob = new Mob(state.random());
                mob.define(mobConfigs[args[0]], args[1]);
                this.floofModdingResponse(jobID, true, "Mob spawned successfully", {
                    id: mob.id,
                    index: mob.index,
                    rarity: mob.rarity,
                    indexName: mobConfigs[mob.index].name,
                    rarityName: tiers[mob.rarity].name,
                    position: {
                        x: mob.x,
                        y: mob.y
                    }
                });
            } break;
            case "setRoomInfo":
                if (args.length < 1 || args.length > 4) {
                    this.floofModdingResponse(jobID, false, "setRoomInfo(dynamic, width*, height*, mobCount*) requires 1 argument, has 3 extra optional arguments!");
                    return;
                }

                if (!this.validateArg(jobID, "dynamic", args[0], "boolean")) {
                    return;
                }

                if (args[0] === true) {
                    if (args.length !== 1) {
                        this.floofModdingResponse(jobID, false, "setRoomInfo(true) requires no extra arguments!");
                        return;
                    }
                } else {
                    if (
                        !this.validateArg(jobID, "width", args[1], "number", [32 * 8, 32 * 4096]) ||
                        !this.validateArg(jobID, "height", args[2], "number", [32 * 8, 32 * 4096]) ||
                        !this.validateArg(jobID, "mobCount", args[3], "number", [0, 4096])
                    ) {
                        return;
                    }
                }

                state.dynamicRoom = args[0];

                if (!state.dynamicRoom) {
                    state.width = args[1];
                    state.height = args[2];
                    state.maxMobs = args[3];
                }

                state.clients.forEach(client => client.sendRoom());

                this.floofModdingResponse(jobID, true, "Room info set successfully", {
                    dynamic: state.dynamicRoom,
                    width: state.width,
                    height: state.height,
                    mobCount: state.maxMobs
                });
                break;
            case "getRoomInfo":
                if (args.length !== 0) {
                    this.floofModdingResponse(jobID, false, "getRoomInfo() requires 0 arguments!");
                    return;
                }

                this.floofModdingResponse(jobID, true, "Room info fetched successfully", {
                    dynamic: state.dynamicRoom,
                    width: state.width,
                    height: state.height,
                    mobCount: state.maxMobs
                });
                break;
            case "getPlayers":
                if (args.length !== 0) {
                    this.floofModdingResponse(jobID, false, "getPlayers() requires 0 arguments!");
                    return;
                }

                const players = [];

                state.clients.forEach(client => {
                    players.push({
                        clientID: client.id,
                        username: client.username,
                        body: client.body ? {
                            id: client.body.id,
                            slots: client.slots.map(slot => ({
                                index: slot.id,
                                rarity: slot.rarity,
                                indexName: petalConfigs[slot.id].name,
                                rarityName: tiers[slot.rarity].name
                            })),
                            position: {
                                x: client.body.x,
                                y: client.body.y
                            }
                        } : null
                    });
                });

                this.floofModdingResponse(jobID, true, "Players fetched successfully", players);
                break;
            case "getMobs":
                if (args.length !== 0) {
                    this.floofModdingResponse(jobID, false, "getMobs() requires 0 arguments!");
                    return;
                }

                const mobs = [];

                state.entities.forEach(entity => {
                    if (entity.type === ENTITY_TYPES.MOB) {
                        mobs.push({
                            id: entity.id,
                            index: entity.index,
                            rarity: entity.rarity,
                            indexName: mobConfigs[entity.index].name,
                            rarityName: tiers[entity.rarity].name,
                            position: {
                                x: entity.x,
                                y: entity.y
                            }
                        });
                    }
                });

                this.floofModdingResponse(jobID, true, "Mobs fetched successfully", mobs);
                break;
            case "getPetalInfo": {
                if (args.length !== 1) {
                    this.floofModdingResponse(jobID, false, "getPetalInfo(index) requires 1 argument!");
                    return;
                }

                if (!this.validateArg(jobID, "index", args[0], "number", [0, petalConfigs.length - 1])) {
                    return;
                }

                this.floofModdingResponse(jobID, true, "Petal info fetched successfully", petalConfigs[args[0]], ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig);
            } break;
            case "createCustomPetal": {
                if (args.length !== 1) {
                    this.floofModdingResponse(jobID, false, "createCustomPetal(options) requires 1 argument!");
                    return;
                }

                const options = args[0];
                if (options.drawing) {
                    options.drawing = Drawing.fromString(options.drawing);
                }

                options.id = petalConfigs.length;

                petalConfigs.push(ModdingAPI.assignTransferrableType(options, ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig));

                sendMockups();

                this.floofModdingResponse(jobID, true, "Custom petal created successfully", options, ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig);
            } break;
            case "editPetal": {
                if (args.length !== 1) {
                    this.floofModdingResponse(jobID, false, "editPetal(options) requires 1 argument!");
                    return;
                }

                if (petalConfigs[args[0].id] == null) {
                    this.floofModdingResponse(jobID, false, "Petal does not exist");
                    return;
                }

                const options = args[0];
                if (options.drawing) {
                    options.drawing = Drawing.fromString(options.drawing);
                }

                petalConfigs[options.id] = ModdingAPI.assignTransferrableType(options, ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig);

                sendMockups();

                state.entities.forEach(e => {
                    if (e.type !== ENTITY_TYPES.PLAYER) {
                        return;
                    }

                    /** @type {Player} */
                    const player = e;

                    player.petalSlots.forEach(slot => {
                        if (slot.config.id === options.id) {
                            slot.destroy();
                            slot.define(petalConfigs[options.id], slot.rarity);
                        }
                    });
                });

                this.floofModdingResponse(jobID, true, "Petal edited successfully", options, ModdingAPI.TRANSFERRABLE_TYPES.PetalConfig);
            } break;
            case "setSlot": {
                if (args.length !== 4) {
                    this.floofModdingResponse(jobID, false, "setSlot(clientID, slotID, index, rarity) requires 4 arguments!");
                    return;
                }

                if (
                    !this.validateArg(jobID, "clientID", args[0], "number") ||
                    !this.validateArg(jobID, "slotID", args[1], "number") ||
                    !this.validateArg(jobID, "index", args[2], "number", [0, petalConfigs.length - 1]) ||
                    !this.validateArg(jobID, "rarity", args[3], "number", [0, tiers.length - 1])
                ) {
                    return;
                }

                const client = state.clients.get(args[0]);

                if (!client) {
                    this.floofModdingResponse(jobID, false, "Client not found. Try to fetch the players and find the client ID you need");
                    return;
                }

                if (!client.body) {
                    this.floofModdingResponse(jobID, false, "Client does not have a body");
                    return;
                }

                if (args[1] < 0 || args[1] >= client.body.petalSlots.length) {
                    this.floofModdingResponse(jobID, false, `Slot ${args[1]} does not exist`);
                    return;
                }

                client.slots[args[1]].id = args[2];
                client.slots[args[1]].rarity = args[3];
                client.body.setSlot(args[1], args[2], args[3]);

                this.floofModdingResponse(jobID, true, "Slot set successfully", {
                    clientID: client.id,
                    slotIndex: args[1],
                    petalIndex: args[2],
                    rarity: args[3],
                    indexName: petalConfigs[args[2]].name,
                    rarityName: tiers[args[3]].name
                });
            } break;
            case "deletePetal": {
                if (args.length !== 1) {
                    this.floofModdingResponse(jobID, false, "deletePetal(index) requires 1 argument!");
                    return;
                }

                if (!this.validateArg(jobID, "index", args[0], "number", [0, petalConfigs.length - 1])) {
                    return;
                }

                if (args[0] < DEFAULT_PETAL_COUNT) {
                    petalConfigs[args[0]] = new PetalConfig("Deleted Petal", 0, 0, 0);
                } else {
                    petalConfigs.splice(args[0], 1);
                }

                for (let i = 0; i < petalConfigs.length; i++) {
                    petalConfigs[i].id = i;
                }

                PetalConfig.idAccumulator = petalConfigs.length;

                state.entities.forEach(e => {
                    if (e.type !== ENTITY_TYPES.PLAYER) {
                        return;
                    }

                    /** @type {Player} */
                    const player = e;

                    player.petalSlots.forEach(slot => {
                        if (slot.config.id === args[0]) {
                            slot.destroy();
                            slot.define(petalConfigs[0], slot.rarity);
                        }
                    });
                });

                sendMockups();

                this.floofModdingResponse(jobID, true, "Petal deleted successfully", {
                    index: args[0]
                });
            } break;
            case "setSlotAmount": {
                if (args.length !== 2) {
                    this.floofModdingResponse(jobID, false, "setSlotAmount(clientID, amount) requires 2 arguments!");
                    return;
                }

                if (
                    !this.validateArg(jobID, "clientID", args[0], "number") ||
                    !this.validateArg(jobID, "amount", args[1], "number", [1, 10])
                ) {
                    return;
                }

                const client = state.clients.get(args[0]);

                if (!client) {
                    this.floofModdingResponse(jobID, false, "Client not found. Try to fetch the players and find the client ID you need");
                    return;
                }

                if (!client.body) {
                    this.floofModdingResponse(jobID, false, "Client does not have a body");
                    return;
                }

                client.body.initSlots(args[1]);

                this.floofModdingResponse(jobID, true, "Slot amount set successfully", {
                    clientID: client.id,
                    body: {
                        id: client.body.id,
                        slots: client.body.petalSlots.map(slot => ({
                            index: slot.index,
                            rarity: slot.rarity,
                            indexName: petalConfigs[slot.index].name,
                            rarityName: tiers[slot.rarity].name
                        })),
                        position: {
                            x: client.body.x,
                            y: client.body.y
                        }
                    }
                });
            } break;
            default:
                this.floofModdingResponse(jobID, false, `Function ${functionName} does not exist!`);
        }
    }
}