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

        if (!this.availableMobs.has(id)) {
            this.availableMobs.set(id, new Set());
        }

        if (this.availableMobs.get(id).has(rarity)) {
            return false;
        }

        this.availableMobs.get(id).add(rarity);
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

    serialize() {
        return {
            id: this.id,
            color: this.color,
            autoGenerateRarities: this.autoGenerateRarities,
            availableMobs: (() => {
                const output = [];

                this.availableMobs.forEach((value, key) => {
                    if (value === true) {
                        output.push([key, true]);
                    } else {
                        output.push([key, [...value]]);
                    }
                });

                return output;
            })()
        };
    }

    static deserialize(input) {
        const spawner = new MobSpawner();

        spawner.id = input.id;
        spawner.color = input.color;
        spawner.autoGenerateRarities = input.autoGenerateRarities;
        spawner.availableMobs = new Map();

        input.availableMobs.forEach(([id, raritySet]) => {
            if (raritySet === true) {
                spawner.availableMobs.set(id, true);
            } else {
                spawner.availableMobs.set(id, new Set(raritySet));
            }
        });

        return spawner;
    }
}

export const mainCellTypes = [{
    id: 0,
    name: "Wall",
    color: "#000000"
}, {
    id: 1,
    name: "Player Spawn",
    color: "#FFBE00"
}, {
    id: 2,
    name: "Checkpoint",
    color: "#BEFF00"
}, {
    id: 3,
    name: "Mob Spawn",
    color: "#FFFFFF"
}];

window.MobSpawner = MobSpawner;