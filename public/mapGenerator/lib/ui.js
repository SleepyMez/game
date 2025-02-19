import * as gameConfigs from "../../server/lib/config.js";
import { spawners } from "./state.js";
import { MobSpawner } from "./types.js";

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
        spawner.color = parseInt(colorInput.value.slice(1), 16);
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