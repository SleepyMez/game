import * as gameConfigs from "../../server/lib/config.js";
import FloofMap, { spawners } from "./FloofMap.js";
import { map, selectedMobSpawner, selectMobSpawner, setBrush, setBrushWidth } from "./state.js";
import { mainCellTypes, MobSpawner } from "./types.js";

const mapWidth = document.querySelector("input#mapWidth");
const mapHeight = document.querySelector("input#mapHeight");

mapWidth.addEventListener("input", () => {
    const rawValue = parseInt(mapWidth.value);
    const newValue = Math.max(16, Math.min(255, parseInt(mapWidth.value)));

    if (rawValue === newValue) {
        map.resize(newValue, map.height);
    }
});

mapHeight.addEventListener("input", () => {
    const rawValue = parseInt(mapHeight.value);
    const newValue = Math.max(16, Math.min(255, parseInt(mapHeight.value)));

    if (rawValue === newValue) {
        map.resize(map.width, newValue);
    }
});

const maxRarity = document.querySelector("select#maxRarity");

for (let i = 0; i < gameConfigs.tiers.length; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = gameConfigs.tiers[i].name;

    maxRarity.appendChild(option);
}

maxRarity.addEventListener("change", () => {
    map.maxRarity = parseInt(maxRarity.value);
});

// Auto-select a rarity to sync
maxRarity.value = 4;
map.maxRarity = 4;

const brushType = document.querySelector("select#brushType");
brushType.addEventListener("change", () => {
    let brush = mainCellTypes.find(m => m.name === brushType.value);
    if (brush) {
        setBrush(brush);
    }
});

const brushSize = document.querySelector("input#brushSize");
brushSize.addEventListener("input", () => {
    setBrushWidth(parseInt(brushSize.value));
});

document.querySelector("button#calculateCellScores").addEventListener("click", map.scoreCells.bind(map));

const exportButton = document.querySelector("button#export");
exportButton.addEventListener("click", () => {
    const blob = new Blob([map.serialize()], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "map.json";
    a.click();
    URL.revokeObjectURL(url);
});

const importButton = document.querySelector("button#import");
importButton.addEventListener("click", async () => {
    const importElement = document.createElement("input");
    importElement.type = "file";
    importElement.accept = ".json";

    importElement.addEventListener("change", async () => {
        if (importElement.files[0] == null) {
            return;
        }

        map.deserialize(await importElement.files[0].text());

        mapWidth.value = map.width;
        mapHeight.value = map.height;
        maxRarity.value = map.maxRarity;

        mobSpawnersContainer.querySelectorAll("div.mobSpawner").forEach(spawner => spawner.remove());

        spawners.forEach(spawner => {
            console.log("Creating spawner", spawner);
            const color = spawner.color;
            createNewMobSpawner(spawner, false);
            const mobSpawner = mobSpawnersContainer.lastElementChild;
            mobSpawner.querySelector("input#autoGenerateRarities").checked = spawner.autoGenerateRarities;
            mobSpawner.querySelector("input[type=color]").value = color;
            spawner.color = color;

            spawner.availableMobs.forEach((enablement, index) => {
                console.log("Adding mob", index, enablement);
                if (spawner.autoGenerateRarities) {
                    const mobElement = document.createElement("div");
                    mobElement.classList.add("mob");
                    mobElement.innerHTML = `<span>${gameConfigs.mobConfigs[index].name}</span> <span style="color:#C8C8C8">(Auto)</span>`;
                    mobElement.addEventListener("click", () => mobElement.remove());
                    mobSpawner.querySelector("div.availableMobs").appendChild(mobElement);
                } else {
                    enablement.forEach(rarity => {
                        console.log("Adding mob", index, rarity);
                        const mobElement = document.createElement("div");
                        mobElement.classList.add("mob");
                        mobElement.innerHTML = `<span>${gameConfigs.mobConfigs[index].name}</span> <span style="color:${gameConfigs.tiers[rarity].color}">${gameConfigs.tiers[rarity].name}</span>`;
                        mobElement.addEventListener("click", () => mobElement.remove());
                        mobSpawner.querySelector("div.availableMobs").appendChild(mobElement);
                    });
                }
            });
        });
    });

    importElement.click();
});

const mobSpawnersContainer = document.querySelector("div#mobSpawners");
const mobSpawnerTemplate = document.querySelector("template#mobSpawner");

function createNewMobSpawner(spawner = new MobSpawner(), autoAdd = true) {
    const mobSpawner = mobSpawnerTemplate.content.cloneNode(true).querySelector("div.mobSpawner");

    const mobSelection = mobSpawner.querySelector("select#mobSelection");
    const mobRarity = mobSpawner.querySelector("select#mobRarity");
    const availableMobs = mobSpawner.querySelector("div.availableMobs");

    gameConfigs.mobConfigs.forEach(mobConfig => {
        const option = document.createElement("option");
        option.value = mobConfig.id;
        option.innerText = mobConfig.name;

        mobSelection.appendChild(option);
    });

    gameConfigs.tiers.forEach((tier, i) => {
        const option = document.createElement("option");
        option.value = i;
        option.innerText = tier.name;

        mobRarity.appendChild(option);
    });

    const colorInput = mobSpawner.querySelector("input[type=color]");
    const updateColor = () => {
        spawner.color = colorInput.value;
    }
    colorInput.addEventListener("input", updateColor);
    updateColor();

    const autoGenerateRarities = mobSpawner.querySelector("input#autoGenerateRarities");
    autoGenerateRarities.addEventListener("change", () => {
        spawner.changeAutoGenerate(autoGenerateRarities.checked);
        availableMobs.innerHTML = "";
    });

    const addMob = mobSpawner.querySelector("button#addMob");
    addMob.addEventListener("click", () => {
        if (spawner.autoGenerateRarities) {
            if (spawner.addMob(parseInt(mobSelection.value), true)) {
                const mob = document.createElement("div");
                mob.classList.add("mob");
                mob.innerHTML = `<span>${gameConfigs.mobConfigs[parseInt(mobSelection.value)].name}</span> <span style="color:#C8C8C8">(Auto)</span>`;
                mob.addEventListener("click", () => mob.remove());
                availableMobs.appendChild(mob);
            }

            return;
        }

        if (spawner.addMob(parseInt(mobSelection.value), parseInt(mobRarity.value))) {
            const mob = document.createElement("div");
            mob.classList.add("mob");
            mob.innerHTML = `<span>${gameConfigs.mobConfigs[parseInt(mobSelection.value)].name}</span> <span style="color:${gameConfigs.tiers[parseInt(mobRarity.value)].color}">${gameConfigs.tiers[parseInt(mobRarity.value)].name}</span>`;
            mob.addEventListener("click", () => mob.remove());
            availableMobs.appendChild(mob);
        }
    });

    mobSpawner.querySelector("button#removeSpawner").addEventListener("click", () => {
        mobSpawner.remove();
        spawners.delete(spawner.id);

        if (selectedMobSpawner === spawner.id) {
            selectMobSpawner(null);
        }

        map.checkSpawners();
    });

    mobSpawner.addEventListener("click", () => {
        if (selectedMobSpawner === spawner.id) {
            selectMobSpawner(null);
            mobSpawner.classList.remove("selected");
        } else {
            selectMobSpawner(spawner);
            document.querySelectorAll("div.mobSpawner").forEach(spawner => spawner.classList.remove("selected"));
            mobSpawner.classList.add("selected");
        }
    });

    mobSpawnersContainer.appendChild(mobSpawner);
    if (autoAdd) {
        spawners.set(spawner.id, spawner);
    }
}

document.querySelector("button#createMobSpawner").addEventListener("click", () => createNewMobSpawner());