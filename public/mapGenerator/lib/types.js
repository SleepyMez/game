import * as gameConfigs from "../../server/lib/config.js";

export class MobSpawner {
    static idAccumulator = 0;

    constructor() {
        this.id = MobSpawner.idAccumulator++;
        this.color = 0x000000;
        this.autoGenerateRarities = true;

        /** @type {Map<number, Set<number> | boolean} */
        this.availableMobs = new Map();
    }

    changeAutoGenerate(value) {
        this.autoGenerateRarities = value;
        this.availableMobs.clear();
    }

    addMob(id, rarity) {
        if (this.autoGenerateRarities) {
            if (this.availableMobs.has(id)) {
                return false;
            }

            this.availableMobs.set(id, true);
            return true;
        }

        if (!this.availableMobs.has(rarity)) {
            this.availableMobs.set(rarity, new Set());
        }

        if (this.availableMobs.get(rarity).has(id)) {
            return false;
        }

        this.availableMobs.get(rarity).add(id);
        return true;
    }

    removeMob(id) {
        this.availableMobs.delete(id);
    }

    removeRarity(id, rarity) {
        if (this.autoGenerateRarities) {
            return;
        }

        if (!this.availableMobs.has(id)) {
            return;
        }

        this.availableMobs.get(id).delete(rarity);
        
        if (this.availableMobs.get(id).size === 0) {
            this.availableMobs.delete(id);
        }
    }
}

