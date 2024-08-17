function HTMLifyCode(code) {
    return code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function apply(id, language, code) {
    const element = document.getElementById(id);
    const codeElement = document.createElement("code");
    codeElement.innerHTML = HTMLifyCode(code);
    codeElement.classList.add("language-" + language);
    element.appendChild(codeElement);
}

apply("syncPetalIndex", "js", `floof.syncPetalIndex("Stinger"); // 4
floof.syncPetalIndex("something that doesn't exist"); // -1`);

apply("syncMobIndex", "js", `floof.syncMobIndex("Bee"); // 2
floof.syncMobIndex("something that doesn't exist"); // -1`);

apply("syncRarityIndex", "js", `floof.syncRarityIndex("Epic"); // 3
floof.syncRarityIndex("something that doesn't exist"); // -1`);

apply("nextAvailableIndices", "js", `floof.syncNextAvailablePetalIndex(); // 42
floof.syncNextAvailableMobIndex(); // 17`);

apply("help", "js", `floof.help();`);

apply("asyncResponseTemplate", "json", `{
    ok: true|false,
    message: "did you do it right or why did you fail",
    data: {}|[]|number|string
}`);

apply("getPlayersRequest", "js", `const players = await floof.getPlayers();`);

apply("getPlayersResponse", "json", `{
    "ok": true,
    "message": "Players fetched successfully",
    "data": [{
        "clientID": 1,
        "username": "z46",
        "body": {
            "id": 2,
            "slots": [{
                "index": 0,
                "rarity": 2,
                "indexName": "Basic",
                "rarityName": "Rare"
            }, {
                "index": 1,
                "rarity": 1,
                "indexName": "Light",
                "rarityName": "Uncommon"
            }, {
                "index": 2,
                "rarity": 1,
                "indexName": "Faster",
                "rarityName": "Uncommon"
            }, {
                "index": 3,
                "rarity": 1,
                "indexName": "Heavy",
                "rarityName": "Uncommon"
            }, {
                "index": 4,
                "rarity": 1,
                "indexName": "Stinger",
                "rarityName": "Uncommon"
            }],
            "position": {
                "x": -275.346575794038,
                "y": -105.3564285786419
            }
        }
    }]
}`);

apply("getMobsRequest", "js", `const mobs = await floof.getMobs();`);

apply("getMobsResponse", "json", `{
    "ok": true,
    "message": "Mobs fetched successfully",
    "data": [{
        "id": 2,
        "index": 3,
        "rarity": 0,
        "indexName": "Spider",
        "rarityName": "Common",
        "position": {
            "x": -40.52584171108902,
            "y": -95.4858263836243
        }
    }, {
        "id": 3,
        "index": 6,
        "rarity": 0,
        "indexName": "Roach",
        "rarityName": "Common",
        "position": {
            "x": -28.068029594052902,
            "y": -342.3576587417483
        }
    }, {
        "id": 5,
        "index": 0,
        "rarity": 0,
        "indexName": "Ladybug",
        "rarityName": "Common",
        "position": {
            "x": 174.24373963651712,
            "y": 9.697125856823213
        }
    }, {
        "id": 8,
        "index": 4,
        "rarity": 0,
        "indexName": "Beetle",
        "rarityName": "Common",
        "position": {
            "x": -186.62759176657633,
            "y": 420.0208018087663
        }
    }, {
        "id": 10,
        "index": 0,
        "rarity": 2,
        "indexName": "Ladybug",
        "rarityName": "Rare",
        "position": {
            "x": -370.51889782073056,
            "y": 419.2796338071397
        }
    }, {
        "id": 13,
        "index": 3,
        "rarity": 2,
        "indexName": "Spider",
        "rarityName": "Rare",
        "position": {
            "x": -187.88140002608478,
            "y": 287.53151727329697
        }
    }, {
        "id": 15,
        "index": 3,
        "rarity": 2,
        "indexName": "Spider",
        "rarityName": "Rare",
        "position": {
            "x": 24.383916208695847,
            "y": 78.48064371951968
        }
    }, {
        "id": 16,
        "index": 4,
        "rarity": 0,
        "indexName": "Beetle",
        "rarityName": "Common",
        "position": {
            "x": 163.06685331837113,
            "y": -311.74400329426703
        }
    }]
}`);

apply("spawnMobRequest", "js", `const mob = await floof.spawnMob(6, 3); // With direct numbers
const mob = await floof.spawnMob(floof.syncPetalIndex("Roach"), floof.syncRarityIndex("Epic")); // With petal and rarity names
const mob = await floof.spawnMob("Roach", "Epic"); // With petal and rarity names`);

apply("spawnMobResponse", "json", `{
    "ok": true,
    "message": "Mob spawned successfully",
    "data": {
        "id": 14,
        "index": 6,
        "rarity": 3,
        "indexName": "Roach",
        "rarityName": "Epic",
        "position": {
            "x": -56.68164204262098,
            "y": 396.59460488905347
        }
    }
}`);

apply("getRoomInfoRequest", "js", `const roomInfo = await floof.getRoomInfo();`);

apply("getRoomInfoResponse", "json", `{
    "ok": true,
    "message": "Room info fetched successfully",
    "data": {
        "dynamic": true,
        "width": 1024,
        "height": 1024,
        "mobCount": 10
    }
}`);

apply("setRoomInfoRequest", "js", `const roomInfo = await floof.setRoomInfo(true); // Make the map dynamically resize
const roomInfo = await floof.setRoomInfo(false, 32 * 32, 32 * 128, 64); // Set the map size to a larger rectangle with 64 mobs`);

apply("setRoomInfoResponse", "json", `{
    "ok": true,
    "message": "Room info set successfully",
    "data": {
        "dynamic": true,
        "width": 1024,
        "height": 1024,
        "mobCount": 10
    }
}`);

apply("getPetalInfoRequest", "js", `const petalInfo = await floof.getPetalInfo("Lightning");`);

apply("getPetalInfoResponse", "json", `{
    "ok": true,
    "message": "Petal info fetched successfully",
    "data": <PetalConfig:Lightning>
}`);

apply("addCustomPetalStructure", "js", `class PetalConfig {
    // (name: string, cooldown: int, health: float, damage: float)
    // Cooldown is in ticks, 22 ticks = 1 second
    constructor(name, cooldown, health, damage) {}

    // (name: string)
    setName(name) {}

    // (description: string)
    setDescription(description) {}

    // (cooldown: int)
    // Cooldown is in ticks, 22 ticks = 1 second
    setCooldown(cooldown) {}

    // (health: float)
    setHealth(health) {}

    // (damage: float)
    setDamage(damage) {}

    // (sizeRatio: float)
    // This is multiplicatively applied to the size of the petal
    setSize(sizeRatio) {}

    // (count: int|int[], clumps: bool)
    // You can provide an array of integers for count, or just provide one integer
    setMulti(count, clumps) {}

    // (customDrawing: Drawing)
    // Drawing is a class that you can use to create custom drawings,
    // you must provide an instance of the Drawing class to this function
    setDrawing(customDrawing) {}

    // (extraRadians: float)
    setExtraRadians(extraRadians) {}

    // (extraHealth: float)
    // This will automatically scale to each tier
    setExtraHealth(extraHealth) {}

    // (constantHeal: float, healsInDefense: bool)
    // This will automatically scale to each tier
    // If you don't provide healsInDefense, it will default to false
    setConstantHeal(constantHeal, healsInDefense) {}

    // (wingMovement: bool)
    setWingMovement(wingMovement) {}

    // (damageReduction: float)
    // This will automatically scale to each tier
    setDamageReduction(damageReduction) {}

    // (speedMultiplier: float)
    // This will automatically scale to each tier
    setSpeedMultiplier(speedMultiplier) {}

    // (extraSize)
    // This will automatically scale to each tier
    // This is additively applied to the size of the flower
    setSizeMultiplier(sizeMultiplier) {}

    // (launchedSpeed: float, launchedRange: float)
    // This will make the petal launchable
    // If the launchedSpeed is 0, the petal will stand still
    setLaunchable(launchedSpeed, launchedRange) {}

    // (healing: float)
    // This will automatically scale to each tier
    // This is the rose-type healing
    setHealing(healing) {}

    // (yinYangMovement: bool)
    setYinYangMovement(yinYangMovement) {}

    // (speedMultiplier: float, duration: float)
    // The speed multipliier will be applied to the enemy for the duration (in seconds)
    setEnemySpeedMultiplier(speedMultiplier, duration) {}

    // (damage: float, duration: float)
    // This will automatically scale to each tier
    // The scaled damage will be applied to the enemy for the duration (in seconds)
    setPoison(poisonDamage, duration) {}

    // (shootIndex: int)
    // shootIndex must be the index of a prior existing petal
    // Shooting will occur on "fire" input and will kill the petal after shooting the shootIndex petal
    setShootOut(shootIndex) {}

    // (extraRange: float)
    // This will automatically scale to each tier
    // This is additively applied to the petal range of the player
    setExtraRange(extraRange) {}

    // (wearable: bool)
    // You should also setMulti(0, false) with this to remove gaps in the petal ring
    setWearable(wearable) {}

    // (index: int, rarity: int|int[], timer: int)
    // The index must be a valid mob index
    // The rarity may be an array of rarities, or just one rarity index
    // The timer is in ticks, 22 ticks = 1 second
    setSpawnable(index, rarity, timer) {}

    // (extraVision: float)
    // This will automatically scale to each tier
    // This is additively applied to the vision of the player
    setExtraVision(extraVision) {}

    // (index: int, count: int)
    // The index must be a valid petal index
    // The count is the number of splits that will occur
    setSplits(index, count) {}

    // (cooldown: int, range: float, heal: float)
    // Cooldown is in ticks, 22 ticks = 1 second
    // Range and heal will automatically scale to each tier
    // This will heal teammates and yourself within range
    setHealSpit(cooldown, range, heal) {}

    // (cooldown: int, range: float, damage: float, poison: { damage: float, duration: float }, speedDebuff: { multiplier: float, duration: float })
    // Cooldown is in ticks, 22 ticks = 1 second
    // range, damage, poison.damage, and speedDebuff.multiplier will automatically scale to each tier
    // poison.duration and speedDebuff.duration are in seconds, but also increase with tier
    setPentagramAbility(cooldown, range, damage, poison, speedDebuff) {}

    // (bounces: int|int[], range: float, damage: float)
    // Bounces may be an array of integers, or just one integer
    // This will automatically scale range and damage to each tier
    setLightning(bounces, range, damage) {}

    // (extraPickupRange: float)
    // This will automatically scale to each tier
    setExtraPickupRange(extraPickupRange) {}

    // (damageReflection: float)
    // This will automatically scale to each tier
    // damageReflection is a percentage of the damage inflicted
    setDamageReflection(damageReflection) {}

    // (attractsLightning: bool)
    setAttractsLightning(attractsLightning) {}

    // (density: float)
    // This will automatically scale to each tier
    setDensity(density) {}

    // (healthRegain: float)
    // This will automatically scale to each tier
    setDeathDefying(healthRegain) {}

    // (phases: bool)
    setPhases(phases) {}

    // (maxDamage: float|float[], period: int|int[])
    // If maxDamage is not an array, it will scale to each tier
    setAbsorbsDamage(maxDamage, period) {}

    // (canPlaceDown: bool)
    setPlaceDown(canPlaceDown) {}

    // (shield: float|float[])
    setShield(shield) {}

    // (length: float|float[], delay: int|int[])
    // Delay is in ticks
    setBoost(length, delay) {}

    // (healBack: float|float[])
    // This will automatically scale to each tier if it is not an array
    setHealBack(healBack) {}

    // (attractsAggro: bool)
    setAttractsAggro(attractsAggro) {}
}
    
class Drawing {
    constructor() {}

    // (action: string, ...args: any[])
    // The action is a string that represents a drawing action
    // The args are the arguments for the action
    // For all except the ones listed below, the args are the same as their HTML Canvas counterparts
    addAction(action, ...args) {}

    // Specific actions
    // circle: x, y, radius
    // rect: x, y, width, height
    // text: x, y, size, textString
    // line: x1, y1, x2, y2
    // stroke: color, lineWidth
    // fill: color
    // paint: color, lineWidth
    // polygon: sides, radius, rotation
    // spikeBall: sides, radius, rotation
    // dipPolygon: sides, radius, dipMult
    // opacity: opacity
    // blur: color, strength
    // noBlur
}`);

apply("addCustomPetalRequest", "js", `const cfg = new floof.PetalConfig("My 1st Custom", 23, 10, 10);
cfg.setSize(2);
cfg.setMulti(4, true);
cfg.setDrawing(new floof.Drawing().addAction("circle", 0, 0, 1).addAction("fill", "#55CACA"));
const petalRes = await floof.createCustomPetal(cfg);`);

apply("addCustomPetalResponse", "json", `{
    "ok": true,
    "message": "Custom petal created successfully",
    "data": <PetalConfig:My 1st Custom>
}`);

apply("editCustomPetalRequest", "js", `const cfg = (await floof.getPetalInfo("Lightning")).data;
cfg.setDamage(1);
cfg.setMulti(5, false);
const petalRes = await floof.editCustomPetal(cfg);`);

apply("editCustomPetalResponse", "json", `{
    "ok": true,
    "message": "Custom petal edited successfully",
    "data": <PetalConfig:Lightning>
}`);

apply("deletePetalRequest", "js", `const petalRes = await floof.deletePetal("My 1st Custom");`);

apply("setSlotRequest", "js", `const slot = await floof.setSlot(1, 1, 3, 4); // Set the 2nd slot of the 1st player to a Legendary Heavy
const slot = await floof.setSlot(1, 1, "Heavy", "Legendary"); // With petal and rarity names`);

apply("setSlotResponse", "json", `{
    "ok": true,
    "message": "Slot set successfully",
    "data": {
        "clientID": 1,
        "slotIndex": 1,
        "petalIndex": 3,
        "rarity": 4,
        "indexName": "Heavy",
        "rarityName": "Legendary"
    }
}`);

apply("setSlotAmountRequest", "js", `const player = await floof.setSlotAmount(1, 10); // Set the amount of slots of the 1st player to 10`);

apply("setSlotAmountResponse", "json", `{
    "ok": true,
    "message": "Slot amount set successfully",
    "data": {
        "clientID": 1,
        "body": {
            "id": 4,
            "slots": [{
                "index": 0,
                "rarity": 1,
                "indexName": "Basic",
                "rarityName": "Uncommon"
            }, {
                "index": 1,
                "rarity": 1,
                "indexName": "Light",
                "rarityName": "Uncommon"
            }, {
                "index": 2,
                "rarity": 2,
                "indexName": "Faster",
                "rarityName": "Rare"
            }, {
                "index": 3,
                "rarity": 2,
                "indexName": "Heavy",
                "rarityName": "Rare"
            }, {
                "index": 4,
                "rarity": 1,
                "indexName": "Stinger",
                "rarityName": "Uncommon"
            }, {
                "index": 5,
                "rarity": 2,
                "indexName": "Rice",
                "rarityName": "Rare"
            }, {
                "index": 6,
                "rarity": 2,
                "indexName": "Rock",
                "rarityName": "Rare"
            }, {
                "index": 7,
                "rarity": 2,
                "indexName": "Cactus",
                "rarityName": "Rare"
            }, {
                "index": 8,
                "rarity": 2,
                "indexName": "Leaf",
                "rarityName": "Rare"
            }, {
                "index": 9,
                "rarity": 2,
                "indexName": "Wing",
                "rarityName": "Rare"
            }],
            "position": {
                "x": -82.15935779354982,
                "y": -85.6559851709967
            }
        }
    }
}`);

apply("quicklySetSlots", "js", `// Traditional .then() promise method
floof.setSlotAmount(1, 10).then(res => {
    if (!res.ok) {
        console.log(res.message);
        return;
    }

    for (let i = 0; i < 10; i ++) {
        floof.setSlot(1, i, i, i);
    }
});

// Modern async/await method
const res = await floof.setSlotAmount(1, 10);
if (!res.ok) {
    console.log(res.message);
    return;
}

for (let i = 0; i < 10; i ++) {
    floof.setSlot(1, i, i, i);
}`);