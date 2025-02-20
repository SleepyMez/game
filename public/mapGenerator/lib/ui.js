import * as gameConfigs from "../../server/lib/config.js";
import { spawners } from "./FloofMap.js";
import { map, setBrush, setBrushWidth } from "./state.js";
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

document.querySelector("button#calculateCellScores").addEventListener("click", map.scoreCells);

const mobSpawnersContainer = document.querySelector("div#mobSpawners");
const mobSpawnerTemplate = document.querySelector("template#mobSpawner");

function createNewMobSpawner() {
    const spawner = new MobSpawner();
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
    });

    mobSpawnersContainer.appendChild(mobSpawner);
    spawners.set(spawner.id, spawner);
}

document.querySelector("button#createMobSpawner").addEventListener("click", createNewMobSpawner);