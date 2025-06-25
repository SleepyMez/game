import { tiers as _tiers, Drawing, WEARABLES, PetalTier, MobTier, PetalConfig, MobDrop, MobConfig } from "../../lib/protocol.js";
export const tiers = structuredClone(_tiers);
export {
    Drawing,
    WEARABLES,
    PetalTier,
    MobTier,
    PetalConfig,
    MobDrop,
    MobConfig
};

export const petalConfigs = [
    new PetalConfig("Basic", 15, 10, 10)
        .setDescription("A simple petal. Not too strong, not too weak."),
    new PetalConfig("Light", 5, 5, 5)
        .setMulti([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 7, 7], 0)
        .setSize(.75)
        .setDescription("It's very light and recharges quickly, at the cost of damage."),
    new PetalConfig("Faster", 20, 8, 8)
        .setSize(.75)
        .setExtraRadians(.03)
        .setDescription("This one makes your petals spin faster."),
    new PetalConfig("Heavy", 30, 25, 8)
        .setSize(1.25)
        .setDensity(3)
        .setDescription("A more chunky petal that hits harder but takes longer to recharge."),
    new PetalConfig("Stinger", 50, 1, 25)
        .setMulti([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 7, 7], 1)
        .setSize(.8)
        .setDescription("A fragile petal that deals lots of damage."),
    new PetalConfig("Rice", 0, 1E-10, 4)
        .setSize(1.15)
        .setDescription("A bit weak, but recharges instantly."),
    new PetalConfig("Rock", 45, 75, 3)
        .setSize(1.3)
        .setDescription("It's a rock, not much to say about it."),
    new PetalConfig("Cactus", 45, 18, 6)
        .setSize(1.2)
        .setExtraHealth(20)
        .setHuddles(1)
        .setDescription("A petal that gives you extra health. Pretty magical if you ask me."),
    new PetalConfig("Leaf", 10, 8, 6)
        .setSize(1.2)
        .setConstantHeal(4.5)
        .setDescription("A petal that heals you over time by the power of photosynthesis."),
    new PetalConfig("Wing", 15, 10, 10)
        .setSize(1.3)
        .setWingMovement(true)
        .setDescription("It comes and it goes."),
    new PetalConfig("Bone", 33, 12, 6)
        .setSize(1.6)
        .setDamageReduction(.08)
        .setDescription("A petal that reduces incoming damage."),
    new PetalConfig("Dirt", 8, 8, 8)
        .setSize(1.3)
        .setExtraHealth(30)
        .setSpeedMultiplier(.925)
        .setExtraSize(2.5)
        .setHuddles(1)
        .setDescription("The extra soil gives your flower more mass, but it does slow you down a bit..."),
    new PetalConfig("Magnolia", 44, 8, 8)
        .setConstantHeal(2)
        .setExtraHealth(12)
        .setSize(1.5)
        .setDescription("A purely magical petal that heals you over time while simultaneously making you tougher."),
    new PetalConfig("Corn", 22.5 * 5, 900, 4)
        .setSize(1.6)
        .setDescription("It's a piece of corn. They say ants like to snack on it."),
    new PetalConfig("Sand", 8, 6, 8)
        .setSize(.6)
        .setMulti(4, true)
        .setDescription("Some fine grains of sand. They recharge quickly and can pack a punch."),
    new PetalConfig("Orange", 15, 11, 6)
        .setSize(.85)
        .setMulti(3, true)
        .setWingMovement(2)
        .setDescription("A bunch of oranges. They're pretty juicy."),
    new PetalConfig("Missile", 22, 6, 16)
        .setLaunchable(.7, 45)
        .setDescription("You can actually shoot this one!"),
    new PetalConfig("projectile.pea", 1000, 3, 3)
        .setDescription("[object null object]"),
    new PetalConfig("Rose", 15, 4, 4)
        .setHealing(8)
        .setHuddles(1)
        .setDescription("Not great at combat, but it's healing properties are amazing."),
    new PetalConfig("Yin Yang", 15, 9, 11)
        .setYinYang(1)
        .setDescription("The mysterious petal of balance."),
    new PetalConfig("Pollen", 15, 7, 8)
        .setSize(.6)
        .setLaunchable(0, 75)
        .setMulti([1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5], false)
        .setDescription("It makes you sneeze. Don't drop it!"),
    new PetalConfig("Honey", 10, 7, 7)
        .setSize(1.1)
        .setEnemySpeedMultiplier(.45, 5)
        .setDescription("It's sticky and will slow your enemies down."),
    new PetalConfig("Iris", 18, 7, 7)
        .setSize(.9)
        .setPoison(2.5, 6)
        .setDescription("Packs an unexpected punch in its secret weapon: poison."),
    new PetalConfig("Web", 24, 7, 7)
        .setDescription("Sticky!"),
    new PetalConfig("web.mob.launched", 1024, 1E5, 0)
        .setSize(30)
        .setEnemySpeedMultiplier(.334, .05)
        .setIgnoreWalls(1)
        .setDescription("[object null object]"),
    new PetalConfig("Third Eye", 0, 0, 0)
        .setExtraRange(.5)
        .setMulti(0, false)
        .setWearable(WEARABLES.THIRD_EYE)
        .setDescription("Through the eye of the beholder comes extra range."),
    new PetalConfig("Pincer", 24, 7, 8)
        .setSize(1.2)
        .setPoison(1.5, 6)
        .setEnemySpeedMultiplier(.6, 6)
        .setDescription("Poisonous, and it slows down your enemies. A perfect double whammy."),
    new PetalConfig("Beetle Egg", 48, 5, 2)
        .setSize(1.5)
        .setHuddles(1)
        .setDescription("Something might pop out of this!"),
    new PetalConfig("Antennae", 0, 0, 0)
        .setExtraVision(50)
        .setMulti(0, false)
        .setWearable(WEARABLES.ANTENNAE)
        .setDescription("These feelers give you some extra vision."),
    new PetalConfig("Peas", 30, 8, 10)
        .setDescription("A pod of peas. They'll explode if you're not careful."),
    new PetalConfig("Stick", 55, 8, 3)
        .setSize(1.2)
        .setHuddles(1)
        .setMulti(2, false)
        .setDescription("A bundle of sticks... I wonder what'll happen if you spin them around in the desert..."),
    new PetalConfig("scorpion.projectile", 1024, 4, 4)
        .setPoison(1.5, 8)
        .setDescription("[object null object]"),
    new PetalConfig("Dahlia", 10, 5, 5)
        .setHealing(2)
        .setSize(.5)
        .setHuddles(1)
        .setMulti(3, true)
        .setDescription("A very consistent trickle heal."),
    new PetalConfig("Primrose", 25, 12, 4)
        .setSize(1.3)
        .setHuddles(1)
        .setHealSpit(77, 125, 3)
        .setDescription("Said to be from a mystical covenant of witches who specialized in healing nature."),
    new PetalConfig("Fire Spellbook", 35, 9, 8)
        .setSize(1.2)
        .setPentagramAbility(200, 150, 2, {
            damage: 1,
            duration: 4
        }, {
            multiplier: .4,
            duration: 4
        })
        .setHuddles(1)
        .setDescription("A tome of ancient spells. It's said to be able to focus the power of a fallen Demon."),
    new PetalConfig("Deity", 1, 50, 50)
        .setSize(1.15)
        .setMulti(3, true)
        .setHealSpit(10, 1000, 5)
        .setConstantHeal(1000)
        .setExtraHealth(10000)
        .setEnemySpeedMultiplier(.1, 10)
        .setDamageReduction(.2)
        .setExtraRadians(.01)
        .setExtraRange(1.05)
        .setExtraVision(5)
        .setPoison(5, 10)
        .setSpeedMultiplier(1.05)
        .setWingMovement(1)
        .setLightning([5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10], 32 * 16, 128)
        .setDescription("A petal that channels the power of all that came before."),
    new PetalConfig("Lightning", 45, 1E-10, 3)
        .setLightning([3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 9], 32 * 8, 7)
        .setDescription("Shockingly shocking!"),
    new PetalConfig("Powder", 23, 3, 5)
        .setSize(1.65)
        .setSpeedMultiplier(1.0275)
        .setHuddles(1)
        .setDescription("This special cocaine will make you go fast!"),
    new PetalConfig("Ant Egg", 30, 8, 4)
        .setSize(1.1)
        .setMulti(4, false)
        .setHuddles(1)
        .setDescription("A petal that spawns ants. They'll help you out!"),
    new PetalConfig("Yucca", 10, 8, 6)
        .setSize(1.2)
        .setConstantHeal(6.5, true)
        .setDescription("A strange leaf that heals you but only when you're in defensive mode."),
    new PetalConfig("Magnet", 45, 9, 6)
        .setSize(1.55)
        .setExtraPickupRange(125)
        .setAttractsLightning(1)
        .setHuddles(1)
        .setDescription("This petal's magnetic field will attract nearby items. Does not stack."),
    new PetalConfig("Amulet", 0, 0, 0)
        .setMulti(0, false)
        .setWearable(WEARABLES.AMULET)
        .setDamageReflection(.175)
        .setDescription("What an oddity! It's said to reflect a portion of incoming conventional damage."),
    new PetalConfig("Jelly", 23, 9, 7)
        .setDensity(25)
        .setDescription("Super bouncy! Knocks all your enemies around. Very fun to use and cause problems with."),
    new PetalConfig("Yggdrasil", 22.5 * 45, 1E-10, 0)
        .setDeathDefying(.15)
        .setHuddles(1)
        .setPhases(1)
        .setDescription("The tree of life. If you were to die with this petal alive, you'd be revived with a portion of your health."),
    new PetalConfig("Glass", 22.5 * 2, 1E-10, 2)
        .setPhases(1)
        .setDescription("A shard of glass that phases through enemies."),
    new PetalConfig("Dandelion", 22, 8, 11)
        .setMulti(2, false)
        .setSize(1.4)
        .setLaunchable(.575, 35)
        .setEnemySpeedMultiplier(.65, 6)
        .setDescription("A paralyzing force."),
    new PetalConfig("Sponge", 22.5, 24, 0)
        .setSize(4 / 3)
        .setHuddles(1)
        .setAbsorbsDamage(35, [
            3 * 22.5, 3 * 22.5, 3 * 22.5,
            4 * 22.5, 4 * 22.5, 4 * 22.5,
            5 * 22.5, 5 * 22.5, 5 * 22.5,
            6 * 22.5, 7 * 22.5, 8 * 22.5
        ])
        .setDescription("It absorbs conventional damage done to your flower. If incoming damage is too great, you will suffer all of the damage the sponge has contained at once."),
    new PetalConfig("Pearl", 37, 23, 7)
        .setSize(2)
        .setPlaceDown(1)
        .setDescription("A pearl that can be placed on the ground. You can call it back to you at any time."),
    new PetalConfig("Shell", 36, 13, 6)
        .setSize(1.5)
        .setShield(10)
        .setHuddles(1)
        .setDescription("A shell that provides extra protection through a shield."),
    new PetalConfig("Bubble", 15, 1E-10, 1E-10)
        .setSize(1.3)
        .setBoost(
            [5, 7, 11, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(e => e * 2 | 0),
            [10, 9, 8, 7, 6, 5, 5, 4, 3, 2, 1, 1].map(e => e * 2.5 | 0)
        )
        .setDescription("It will boost you when you pop it."),
    new PetalConfig("Air", 0, 0, 0)
        .setMulti(0, false)
        .setWearable(WEARABLES.AIR)
        .setExtraSize(3)
        .setDescription("Literally nothing at all, but it puffs you up."),
    new PetalConfig("Starfish", 30, 9, 11)
        .setSize(1.4)
        .setConstantHeal(8, false, .7)
        .setDescription("A leg of a starfish. It will heal you quite effectively while you are under 70% health."),
    new PetalConfig("Fang", 28, 8, 10)
        .setSize(1.15)
        .setHealBack([.2, .25, .3, .35, .4, .45, .5, .55, .6, .65, .7, .75])
        .setDescription("The fang of a dangerous Leech. It will heal back the damage it causes."),
    new PetalConfig("Goo", 35, 12, 12)
        .setSize(1.3)
        .setPoison(1, 6)
        .setEnemySpeedMultiplier(.7, 6)
        .setLaunchable(1, 35)
        .setDescription("This sticky goo isn't good for you..."),
    new PetalConfig("Maggot Poo", 23, 5, 5)
        .setSize(1.3)
        .setDamageReflection(.05)
        .setLaunchable(0, 75)
        .setDescription("A steaming pile of shi- I mean, poo."),
    new PetalConfig("Lightbulb", 33, 10, 10)
        .setSize(1.4)
        .setAttractsAggro(1)
        .setHuddles(1)
        .setLighting(1)
        .setDescription("Mobs will be prioritize yourshiny bulbs when they aggro when in use. The priority increases with each rarity, and stacks with itself."),
    new PetalConfig("Battery", 55, 1E-10, 0)
        .setPhases(1)
        .setSize(1.34)
        .setLightning(4, 32 * 8, 5, [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7], true)
        .setDescription("A battery that can release electric charges when hit."),
    new PetalConfig("Dust", 16, 7, 6)
        .setMulti(3, true)
        .setLaunchable(.7, 55)
        .setDensity(5)
        .setDescription("A cloud of dust that can be launched at enemies."),
    new PetalConfig("Armor", 0, 0, 0)
        .setMulti(0, false)
        .setWearable(WEARABLES.ARMOR)
        .setExtraHealth(-10)
        .setDamageReduction(.25)
        .setDescription("This petal greatly protects you, but at a cost..."),
    new PetalConfig("wasp.projectile", 1024, 4, 4)
        .setPoison(2, 8)
        .setDescription("[object null object]"),
    new PetalConfig("Shrub", 45, 18, 6)
        .setSize(1.2)
        .setExtraHealth(15)
        .setPoison(3, 2)
        .setDescription("Extra HP with a bonus: poison!"),
    new PetalConfig("projectile.grape", 1000, 1, 4)
        .setPoison(.75, 6)
        .setDescription("[object null object]"),
    new PetalConfig("Grapes", 50, 4, 10)
        .setPoison(1.5, 8)
        .setDescription("With an added bonus: Poison!"),
    new PetalConfig("Lantern", 112.5, 1, 5)
        .setHuddles(1)
        .setDescription("This fragine lantern shines so bright...")
        .setLighting(3),
    new PetalConfig("web.player.launched", 1024, 1E5, 0)
        .setSize(30)
        .setEnemySpeedMultiplier(.334, .05)
        .setIgnoreWalls(1)
        .setDescription("[object null object]"),
    new PetalConfig("Branch", 22.5 * 3.5, 8, 3)
        .setSize(1.5)
        .setHuddles(1)
        .setMulti(2, false)
        .setDescription("A fragile branch from the Wilt."),
    new PetalConfig("Leech Egg", 48, 5, 2)
        .setSize(1.5)
        .setHuddles(1)
        .setDescription("Summons leeches to help protect you!"),
    new PetalConfig("Hornet Egg", 48, 5, 2)
        .setSize(1.5)
        .setMulti(2, false)
        .setHuddles(1)
        .setDescription("Hey wait a minute... This isn't a Beetle Egg!"),
    new PetalConfig("Candy", 22.5, 1, 2.5)
        .setSize(.9)
        .setMulti(5, true)
        .setDescription("Ooh, tasty!"),
    new PetalConfig("Claw", 56.25, 0.25, 8)
        .setExtraDamage(.75, 1, 7.5)
        .setDescription("Sharp against the strong, weak against the weak."),
    new PetalConfig("projectile.diep_bullet", 1000, 12, 2)
        .setDescription("[object null object]"),
    new PetalConfig("Square Egg", 120, 50, 1)
        .setSize(1.2)
        .setHuddles(1)
        .setDescription("This isn't from this world..."),
    new PetalConfig("Triangle Egg", 240, 100, 2)
        .setSize(1.5)
        .setHuddles(1)
        .setDescription("This isn't from this world..."),
    new PetalConfig("Pentagon Egg", 360, 200, 4)
        .setSize(1.8)
        .setHuddles(1)
        .setDescription("This isn't from this world...")
];

export const petalIDOf = name => petalConfigs.findIndex(p => p.name === name);

// After references are set
petalConfigs[petalIDOf("Web")].setShootOut(petalIDOf("web.player.launched"));
petalConfigs[petalIDOf("Peas")].setSplits(petalIDOf("projectile.pea"), 4);
petalConfigs[petalIDOf("Grapes")].setSplits(petalIDOf("projectile.grape"), 4);

export const mobConfigs = [
    new MobConfig("Ladybug", 22, 5, 20, 2.5)
        .addDrop(petalIDOf("Light"))
        .addDrop(petalIDOf("Rose"), .6)
        .addDrop(petalIDOf("Pollen"), .4),
    new MobConfig("Rock", 55, 5, 20, 0)
        .addDrop(petalIDOf("Rock"))
        .addDrop(petalIDOf("Heavy"), .5),
    new MobConfig("Bee", 12, 25, 18, 4)
        .setNeutral(1)
        .addDrop(petalIDOf("Stinger"))
        .addDrop(petalIDOf("Pollen", .6))
        .addDrop(petalIDOf("Honey"), .4),
    new MobConfig("Spider", 12, 4, 12, 4)
        .setAggressive(1)
        .setPoison(1, 3)
        .setProjectile({
            petalIndex: petalIDOf("web.mob.launched"),
            cooldown: 25,
            health: Infinity,
            damage: 0,
            speed: 0,
            range: 175,
            size: 1,
            runs: true,
            nullCollision: true
        })
        .addDrop(petalIDOf("Faster"))
        .addDrop(petalIDOf("Web"), .5)
        .addDrop(petalIDOf("Third Eye"), .025, 5),
    new MobConfig("Beetle", 40, 4, 24, 3)
        .setAggressive(1)
        .addDrop(petalIDOf("Iris"))
        .addDrop(petalIDOf("Pincer"), .8)
        .addDrop(petalIDOf("Beetle Egg"), .225),
    new MobConfig("Leafbug", 35, 2, 22, 2.5)
        .setAggressive(1)
        .setDamageReduction(.13)
        .addDrop(petalIDOf("Leaf"))
        .addDrop(petalIDOf("Bone"), .5)
        .addDrop(petalIDOf("Cactus"), .25),
    new MobConfig("Roach", 18, 3, 20, 5.5)
        .setNeutral(1)
        .addDrop(petalIDOf("Antennae"))
        .addDrop(petalIDOf("Magnolia"), .6)
        .addDrop(petalIDOf("Bone"), .6),
    new MobConfig("Hornet", 55, 4, 24, 3)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("Missile"),
            cooldown: 45,
            health: 4,
            damage: 5,
            speed: 3.75,
            range: 55
        })
        .addDrop(petalIDOf("Missile"))
        .addDrop(petalIDOf("Antennae"), .5)
        .addDrop(petalIDOf("Orange"), .8),
    new MobConfig("Mantis", 44, 2, 26, 2)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("projectile.pea"),
            cooldown: 80,
            health: 1.25,
            damage: 1.5,
            speed: 4.5,
            range: 55,
            size: .2,
            multiShot: {
                count: 3,
                delay: 256
            }
        })
        .addDrop(petalIDOf("Peas"))
        .addDrop(petalIDOf("Dahlia"), .5)
        .addDrop(petalIDOf("Antennae"), .5),
    new MobConfig("Pupa", 80, 1, 18, 1)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalConfigs.findIndex(p => p.name === "Rock"),
            cooldown: 55,
            health: .8,
            damage: 1.1,
            speed: 4,
            range: 45,
            size: .3,
            multiShot: {
                count: 5,
                delay: 10,
                spread: .2
            }
        })
        .addDrop(petalIDOf("Rock"))
        .addDrop(petalIDOf("Wing"))
        .addDrop(petalIDOf("Heavy"), .5),
    new MobConfig("Sandstorm", 33, 4, 25, 4.5)
        .setAggressive(1)
        .setSandstormMovement(1)
        .setSize(17, MobTier.SIZE_SCALE, .9, .25)
        .addDrop(petalIDOf("Sand"), 1)
        .addDrop(petalIDOf("Glass"), .7)
        .addDrop(petalIDOf("Stick"), .2, 2),
    new MobConfig("Scorpion", 33, 3, 27, 3)
        .setAggressive(1)
        .setStrafes(30, 15, 1.25)
        .setProjectile({
            petalIndex: petalConfigs.findIndex(p => p.name === "scorpion.projectile"),
            cooldown: 45,
            health: 2,
            damage: 2,
            speed: 5,
            range: 65,
            size: .2
        })
        .addDrop(petalIDOf("Pincer"))
        .addDrop(petalIDOf("Iris")),
    new MobConfig("Demon", 225, 1, 35, 1)
        .setAggressive(1)
        .setPushability(0.8)
        .setProjectile({
            petalIndex: petalConfigs.findIndex(p => p.name === "Missile"),
            cooldown: 65,
            health: 1,
            damage: 1,
            speed: 5,
            range: 120,
            size: .1334,
            multiShot: {
                count: 4,
                delay: 128,
                spread: .5
            }
        })
        .addDrop(petalIDOf("Bone"))
        .addDrop(petalIDOf("Lightning"), .2)
        .addDrop(petalIDOf("Fire Spellbook"), .03),
    new MobConfig("Jellyfish", 65, 1, 22, 2.5)
        .setAggressive(1)
        .setLightning([75, 75, 75, 65, 65, 65, 55, 55, 55, 45, 35, 25], [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8], 125, 2)
        .addDrop(petalIDOf("Lightning"))
        .addDrop(petalIDOf("Jelly")),
    new MobConfig("Cactus", 33, 4, 24, 0)
        .setPushability(0.5)
        .addDrop(petalIDOf("Cactus"), .9)
        .addDrop(petalIDOf("Stinger"), 2)
        .addDrop(petalIDOf("Stick"), .05),
    new MobConfig("Baby Ant", 8, .5, 7, 2)
        .addDrop(petalIDOf("Light"), .4)
        .addDrop(petalIDOf("Faster"), .4)
        .addDrop(petalIDOf("Rice"), .4),
    new MobConfig("Worker Ant", 16, 1, 9, 3.25)
        .setNeutral(1)
        .addDrop(petalIDOf("Light"), .4)
        .addDrop(petalIDOf("Leaf"), .4)
        .addDrop(petalIDOf("Corn"), .4),
    new MobConfig("Soldier Ant", 24, 2, 11, 3.5)
        .setAggressive(1)
        .addDrop(petalIDOf("Faster"), .4)
        .addDrop(petalIDOf("Wing"), .2)
        .addDrop(petalIDOf("Glass"), .1),
    new MobConfig("Queen Ant", 100, 2, 20, 3.5)
        .setAggressive(1)
        .setPushability(0.8)
        .addDrop(petalIDOf("Dahlia"))
        .addDrop(petalIDOf("Dirt"), .5)
        .addDrop(petalIDOf("Ant Egg"), .8),
    new MobConfig("Ant Hole", 150, 1, 30, 0)
        .setPushability(0)
        .addDrop(petalIDOf("Dirt"))
        .addDrop(petalIDOf("Ant Egg"), .5),
    new MobConfig("Baby Fire Ant", 6, 1, 5, 3)
        .addDrop(petalIDOf("Light"), .4)
        .addDrop(petalIDOf("Yucca"), .4),
    new MobConfig("Worker Fire Ant", 12, 3, 7, 4)
        .setNeutral(1)
        .addDrop(petalIDOf("Light"), .4)
        .addDrop(petalIDOf("Yucca"), .4)
        .addDrop(petalIDOf("Corn"), .4),
    new MobConfig("Soldier Fire Ant", 16, 4, 9, 4)
        .setAggressive(1)
        .addDrop(petalIDOf("Faster"), .4)
        .addDrop(petalIDOf("Wing"), .2)
        .addDrop(petalIDOf("Yucca"), .1),
    new MobConfig("Queen Fire Ant", 55, 4, 15, 4)
        .setAggressive(1)
        .setPushability(0.8)
        .addDrop(petalIDOf("Primrose"))
        .addDrop(petalIDOf("Dirt"), .5)
        .addDrop(petalIDOf("Ant Egg"), .8),
    new MobConfig("Fire Ant Hole", 75, 2, 18, 0)
        .setPushability(0)
        .addDrop(petalIDOf("Dirt"))
        .addDrop(petalIDOf("Ant Egg"), .5)
        .addDrop(petalIDOf("Magnet"), .4),
    new MobConfig("Baby Termite", 6, .3, 10, 2)
        .setDamageReduction(.1)
        .setDamageReflection(.15)
        .addDrop(petalIDOf("Bone"), .5)
        .addDrop(petalIDOf("Amulet"), .15),
    new MobConfig("Worker Termite", 12, 1, 12, 3)
        .setNeutral(1)
        .setDamageReduction(.1)
        .setDamageReflection(.15)
        .addDrop(petalIDOf("Bone"), .5)
        .addDrop(petalIDOf("Amulet"), .15),
    new MobConfig("Soldier Termite", 16, 2, 14, 3)
        .setAggressive(1)
        .setDamageReduction(.1)
        .setDamageReflection(.15)
        .addDrop(petalIDOf("Bone"), .5)
        .addDrop(petalIDOf("Amulet"), .15),
    new MobConfig("Termite Overmind", 125, 2, 45, .5)
        .setAggressive(1)
        .setPushability(0.5)
        .setDamageReduction(.1)
        .setDamageReflection(.15)
        .addDrop(petalIDOf("Ant Egg"), .5)
        .addDrop(petalIDOf("Amulet"), .4)
        .addDrop(petalIDOf("Primrose"), .7),
    new MobConfig("Termite Mound", 350, 1, 60, 0)
        .setDamageReduction(.1)
        .setDamageReflection(.15)
        .setPushability(0)
        .addDrop(petalIDOf("Dirt"))
        .addDrop(petalIDOf("Armor"), .75)
        .addDrop(petalIDOf("Magnet"), .5),
    new MobConfig("Ant Egg", 25, 2, 10, 0)
        .addDrop(petalIDOf("Ant Egg"), .8)
        .addDrop(petalIDOf("Dirt"), .1),
    new MobConfig("Queen Ant Egg", 16, 1, 13, 0)
        .addDrop(petalIDOf("Ant Egg"), .4)
        .addDrop(petalIDOf("Dirt"), .1),
    new MobConfig("Fire Ant Egg", 25, 2, 8, 0)
        .addDrop(petalIDOf("Ant Egg"), .8)
        .addDrop(petalIDOf("Yucca"), .8),
    new MobConfig("Queen Fire Ant Egg", 16, 1, 10, 0)
        .addDrop(petalIDOf("Ant Egg"), .4)
        .addDrop(petalIDOf("Yucca"), .4),
    new MobConfig("Termite Egg", 25, 2, 13, 0)
        .addDrop(petalIDOf("Ant Egg"), .8)
        .addDrop(petalIDOf("Bone"), .8),
    new MobConfig("Evil Ladybug", 28, 6, 21, 3)
        .setAggressive(1)
        .setDamageReduction(.15)
        .addDrop(petalIDOf("Dahlia"))
        .addDrop(petalIDOf("Yin Yang"), .15),
    new MobConfig("Shiny Ladybug", 28, 6, 21, 3)
        .setNeutral(1)
        .addDrop(petalIDOf("Primrose"))
        .addDrop(petalIDOf("Yggdrasil"), .15, 3),
    new MobConfig("Angelic Ladybug", 30, 3, 22, 4)
        .setNeutral(1)
        .setDamageReflection(.05)
        .addDrop(petalIDOf("Dahlia"))
        .addDrop(petalIDOf("Yin Yang"), .15)
        .addDrop(petalIDOf("Third Eye"), .05, 3),
    new MobConfig("Centipede", 25, 2, 24, 4)
        .setNeutral(1)
        .addDrop(petalIDOf("Peas"), .5)
        .addDrop(petalIDOf("Leaf"), .5),
    new MobConfig("Centipede", 25, 2, 24, 4)
        .setSystem(1)
        .setNeutral(1)
        .addDrop(petalIDOf("Peas"), .5)
        .addDrop(petalIDOf("Leaf"), .5),
    new MobConfig("Desert Centipede", 16, 3, 17, 6)
        .setSandstormMovement(1)
        .addDrop(petalIDOf("Powder"), .5)
        .addDrop(petalIDOf("Sand"), .5),
    new MobConfig("Desert Centipede", 16, 3, 17, 6)
        .setSystem(1)
        .setSandstormMovement(1)
        .addDrop(petalIDOf("Powder"), .5)
        .addDrop(petalIDOf("Sand"), .5),
    new MobConfig("Evil Centipede", 22, 3, 22, 4)
        .setAggressive(1)
        .addDrop(petalIDOf("Iris"), .5)
        .addDrop(petalIDOf("Grapes"), .5),
    new MobConfig("Evil Centipede", 22, 3, 22, 4)
        .setSystem(1)
        .setAggressive(1)
        .addDrop(petalIDOf("Iris"), .5)
        .addDrop(petalIDOf("Grapes"), .5),
    new MobConfig("Dandelion", 22, 1, 20, 0)
        .setPushability(0.5)
        .addDrop(petalIDOf("Dandelion"))
        .addDrop(petalIDOf("Pollen"), .5),
    new MobConfig("Sponge", 27, 1, 23, 0)
        .addDrop(petalIDOf("Sponge")),
    new MobConfig("Bubble", 1, 3, 22, 0)
        .addDrop(petalIDOf("Bubble"), .8)
        .addDrop(petalIDOf("Air"), .8),
    new MobConfig("Shell", 26, 4, 23, 30)
        .setMovesInBursts(1)
        .setNeutral(1)
        .addDrop(petalIDOf("Shell"), .8)
        .addDrop(petalIDOf("Pearl"), .5)
        .addDrop(petalIDOf("Magnet"), .2),
    new MobConfig("Starfish", 30, 1, 22, 4)
        .setAggressive(1)
        .setSpins(1)
        .setHealing(.01)
        .setFleeAtLowHealth(.35)
        .addDrop(petalIDOf("Starfish"), .85)
        .addDrop(petalIDOf("Sand"), .85),
    new MobConfig("Leech", 20, 1, 12, 5.5)
        .setAggressive(1)
        .addDrop(petalIDOf("Fang"))
        .addDrop(petalIDOf("Faster")),
    new MobConfig("Maggot", 24, 1, 24, 2)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("Goo"),
            cooldown: 56,
            health: 2,
            damage: 1,
            speed: 3,
            range: 45,
            size: .35
        })
        .addDrop(petalIDOf("Goo"))
        .addDrop(petalIDOf("Maggot Poo"), .5)
        .addDrop(petalIDOf("Dirt"), .65),
    new MobConfig("Firefly", 23, 2, 16, 4)
        .setMoveInSines(1)
        .addDrop(petalIDOf("Wing"))
        .addDrop(petalIDOf("Lightbulb"), .6)
        .addDrop(petalIDOf("Battery"), .4),
    new MobConfig("Bumblebee", 29, 4, 18, 5)
        .setMoveInSines(1)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("Pollen"),
            cooldown: 11,
            health: 2,
            damage: 2,
            speed: 0,
            range: 90
        })
        .addDrop(petalIDOf("Pollen"))
        .addDrop(petalIDOf("Honey"), .6),
    new MobConfig("Moth", 19, 2, 16, 3)
        .setMoveInSines(1)
        .setNeutral(1)
        .setFleeAtLowHealth(1)
        .addDrop(petalIDOf("Wing"))
        .addDrop(petalIDOf("Lightbulb"), .6)
        .addDrop(petalIDOf("Dust"), .4),
    new MobConfig("Fly", 18, 3, 14, 6)
        .setAggressive(1)
        .setMoveInSines(1)
        .addDrop(petalIDOf("Wing"))
        .addDrop(petalIDOf("Faster"), .8)
        .addDrop(petalIDOf("Third Eye"), .02, 5),
    new MobConfig("Square", 12, 2, 13, 0)
        .setSystem(1),
    new MobConfig("Triangle", 18, 3, 15, 0)
        .setSystem(1),
    new MobConfig("Pentagon", 26, 4, 17, 0)
        .setSystem(1),
    new MobConfig("Hell Beetle", 45, 4.5, 25, 3.5)
        .setAggressive(1)
        .setPushability(0.8)
        .addDrop(petalIDOf("Dust"), .8)
        .addDrop(petalIDOf("Pincer"), .8)
        .addDrop(petalIDOf("Beetle Egg"), .8),
    new MobConfig("Hell Spider", 15, 5, 17, 4.5)
        .setAggressive(1)
        .setPoison(1, 3)
        .setPushability(0.8)
        .addDrop(petalIDOf("Faster"))
        .addDrop(petalIDOf("Web"), .5)
        .addDrop(petalIDOf("Dahlia"), .5)
        .setProjectile({
            petalIndex: petalIDOf("web.mob.launched"),
            cooldown: 25,
            health: Infinity,
            damage: 0,
            speed: 0,
            range: 175,
            size: 1,
            runs: true,
            nullCollision: true
        }),
    new MobConfig("Hell Yellowjacket", 65, 5, 25, 4)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("Missile"),
            cooldown: 85,
            health: 4,
            damage: 4,
            speed: 4.5,
            range: 65,
            aimbot: true
        })
        .setPushability(0.8)
        .addDrop(petalIDOf("Missile"))
        .addDrop(petalIDOf("Antennae"), .5),
    new MobConfig("Termite Overmind Egg", 16, 1, 17, 0)
        .addDrop(petalIDOf("Ant Egg"), .4)
        .addDrop(petalIDOf("Amulet"), .4),
    new MobConfig("Spirit", 1e-10, 0, 35, 1)
        .setSpins(4, 1)
        .addDrop(petalIDOf("Candy"), .1),
    new MobConfig("Wasp", 55, 4, 24, 3)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("wasp.projectile"),
            cooldown: 95,
            health: 13,
            damage: 1.25,
            speed: 2.25,
            range: 185,
            multiShot: {
                count: 3,
                delay: 256,
                spread: .2
            }
        })
        .addDrop(petalIDOf("Missile"))
        .setPushability(.8)
        .addDrop(petalIDOf("Antennae"), .7)
        .addDrop(petalIDOf("Pollen"), .4),
    new MobConfig("Stickbug", 10, 6, 8, 7)
        .setAggressive(1)
        .setPoison(2, 4)
        .addDrop(petalIDOf("Iris"), .75)
        .addDrop(petalIDOf("Powder")),
    new MobConfig("Shrub", 14, 3, 24, 0)
        .setPoison(3, 5)
        .setPushability(0.5)
        .addDrop(petalIDOf("Iris"), .75)
        .addDrop(petalIDOf("Shrub"), .6)
        .addDrop(petalIDOf("Leaf")),
    new MobConfig("Hell Centipede", 16, 3, 17, 4.5)
        .setAggressive(1)
        .setSize(17, MobTier.SIZE_SCALE, .75, .25)
        .addDrop(petalIDOf("Powder"), .5)
        .addDrop(petalIDOf("Dust"), .5),
    new MobConfig("Hell Centipede", 16, 3, 17, 4.5)
        .setSystem(1)
        .setAggressive(1)
        .setSize(17, MobTier.SIZE_SCALE, .75, .25)
        .addDrop(petalIDOf("Powder"), .5)
        .addDrop(petalIDOf("Dust"), .5),
    new MobConfig("Wilt", 16, 3, 20, 0)
        .setPushability(0)
        .addDrop(petalIDOf("Branch"))
        .addDrop(petalIDOf("Leaf"), .6),
    new MobConfig("Wilt", 16, 3, 10, 2.5)
        .setSystem(1)
        .setAggressive(1)
        .setSize(10, MobTier.SIZE_SCALE, .75, .25)
        .addDrop(petalIDOf("Branch"))
        .addDrop(petalIDOf("Leaf"), .6),
    new MobConfig("Pumpkin", 25, 2, 10, 0)
        .setSize(10, MobTier.SIZE_SCALE, .75, .25)
        .addDrop(petalIDOf("Leaf", .5))
        .addDrop(petalIDOf("Candy", .6))
        .addDrop(petalIDOf("Lantern", .1)),
    new MobConfig("Jack O' Lantern", 34, 4, 13, 0)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("Candy"),
            cooldown: 3,
            health: 1,
            damage: 1,
            speed: 5,
            range: 20,
            size: .4
        })
        .addDrop(petalIDOf("Rock", .5))
        .addDrop(petalIDOf("Candy", .6))
        .addDrop(petalIDOf("Lantern", .1)),
    new MobConfig("Crab", 25, 4, 20, 7.5)
        .setAggressive(1)
        .setStrafes(125, 25, .5)
        .addDrop(petalIDOf("Sand", .4))
        .addDrop(petalIDOf("Claw", .825)),
    new MobConfig("Tank", 100, 1, 20, 2)
        .setAggressive(1)
        .setProjectile({
            petalIndex: petalIDOf("projectile.diep_bullet"),
            cooldown: 12,
            health: 12,
            damage: 2,
            speed: 4,
            range: 50,
            size: .4,
            aimbot: true
        })
        .addDrop(petalIDOf("Square Egg"), .1)
        .addDrop(petalIDOf("Triangle Egg"), .05)
        .addDrop(petalIDOf("Pentagon Egg"), .01)
];

// Flu: Wing, Faster, Third Eye

export const mobIDOf = name => mobConfigs.findIndex(m => m.name === name);

petalConfigs[petalIDOf("Beetle Egg")].setSpawnable(mobIDOf("Beetle"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
petalConfigs[petalIDOf("Stick")].setSpawnable(mobIDOf("Sandstorm"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
petalConfigs[petalIDOf("Ant Egg")].setSpawnable(mobIDOf("Soldier Ant"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6);
petalConfigs[petalIDOf("Branch")].setSpawnable(mobIDOf("Wilt") + 1, [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
petalConfigs[petalIDOf("Leech Egg")].setSpawnable(mobIDOf("Leech"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6);
petalConfigs[petalIDOf("Hornet Egg")].setSpawnable(mobIDOf("Hornet"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6);
petalConfigs[petalIDOf("Square Egg")].setSpawnable(mobIDOf("Square"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
petalConfigs[petalIDOf("Triangle Egg")].setSpawnable(mobIDOf("Triangle"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);
petalConfigs[petalIDOf("Pentagon Egg")].setSpawnable(mobIDOf("Pentagon"), [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4);

mobConfigs[mobIDOf("Angelic Ladybug")].setPoopable({
    index: mobIDOf("Evil Ladybug"),
    interval: 22.5 * 6
});

mobConfigs[mobIDOf("Ant Hole")].setAntHoleSpawns([{
    index: mobIDOf("Baby Ant"),
    count: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
}, {
    index: mobIDOf("Worker Ant"),
    count: [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
}, {
    index: mobIDOf("Soldier Ant"),
    count: [6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
}, {
    index: mobIDOf("Ant Egg"),
    count: 5
}, {
    index: mobIDOf("Queen Ant"),
    count: 1,
    minHealthRatio: .3
}]);

mobConfigs[mobIDOf("Fire Ant Hole")].setAntHoleSpawns([{
    index: mobIDOf("Baby Fire Ant"),
    count: [4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7]
}, {
    index: mobIDOf("Worker Fire Ant"),
    count: [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8]
}, {
    index: mobIDOf("Soldier Fire Ant"),
    count: [6, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 9]
}, {
    index: mobIDOf("Fire Ant Egg"),
    count: 5
}, {
    index: mobIDOf("Queen Fire Ant"),
    count: 1,
    minHealthRatio: .25
}]);

mobConfigs[mobIDOf("Termite Mound")].setAntHoleSpawns([{
    index: mobIDOf("Baby Termite"),
    count: 6
}, {
    index: mobIDOf("Worker Termite"),
    count: 8
}, {
    index: mobIDOf("Soldier Termite"),
    count: 8
}, {
    index: mobIDOf("Termite Egg"),
    count: 5
}, {
    index: mobIDOf("Termite Overmind"),
    count: 1,
    minHealthRatio: .5
}]);

mobConfigs[mobIDOf("Ant Egg")].setHatchables([{
    index: mobIDOf("Baby Ant"),
    time: 22.5 * 15
}, {
    index: mobIDOf("Worker Ant"),
    time: 22.5 * 25
}, {
    index: mobIDOf("Soldier Ant"),
    time: 22.5 * 35
}]);

mobConfigs[mobIDOf("Queen Ant Egg")].setHatchables({
    index: mobIDOf("Soldier Ant"),
    time: 22.5 * 1.5
});

mobConfigs[mobIDOf("Queen Ant")].setPoopable({
    index: mobIDOf("Queen Ant Egg"),
    interval: 22.5 * 2
});

mobConfigs[mobIDOf("Fire Ant Egg")].setHatchables([{
    index: mobIDOf("Baby Fire Ant"),
    time: 22.5 * 15
}, {
    index: mobIDOf("Worker Fire Ant"),
    time: 22.5 * 25
}, {
    index: mobIDOf("Soldier Fire Ant"),
    time: 22.5 * 35
}]);

mobConfigs[mobIDOf("Queen Fire Ant Egg")].setHatchables({
    index: mobIDOf("Soldier Fire Ant"),
    time: 22.5 * 1.5
});

mobConfigs[mobIDOf("Queen Fire Ant")].setPoopable({
    index: mobIDOf("Queen Fire Ant Egg"),
    interval: 22.5 * 2
});

mobConfigs[mobIDOf("Termite Egg")].setHatchables([{
    index: mobIDOf("Baby Termite"),
    time: 22.5 * 15
}, {
    index: mobIDOf("Worker Termite"),
    time: 22.5 * 25
}, {
    index: mobIDOf("Soldier Termite"),
    time: 22.5 * 35
}]);

mobConfigs[mobIDOf("Termite Overmind Egg")].setHatchables({
    index: mobIDOf("Soldier Termite"),
    time: 22.5 * 2
});

mobConfigs[mobIDOf("Termite Overmind")].setPoopable({
    index: mobIDOf("Termite Overmind Egg"),
    interval: 22.5 * 4
});

/**
 * 
 * @param {function(MobConfig)} cb 
 * @returns 
 */
export function queryMob(cb) {
    for (let i = 0; i < mobConfigs.length; i++) {
        if (cb(mobConfigs[i])) {
            return i;
        }
    }

    return -1;
}

mobConfigs[mobIDOf("Centipede")].segmentWith(queryMob(m => m.isSystem && m.name === "Centipede"));
mobConfigs[mobIDOf("Desert Centipede")].segmentWith(queryMob(m => m.isSystem && m.name === "Desert Centipede"));
mobConfigs[mobIDOf("Evil Centipede")].segmentWith(queryMob(m => m.isSystem && m.name === "Evil Centipede"));
mobConfigs[mobIDOf("Hell Centipede")].segmentWith(queryMob(m => m.isSystem && m.name === "Hell Centipede"));
mobConfigs[mobIDOf("Wilt")].branchWith(queryMob(m => m.isSystem && m.name === "Wilt"), 7, 3);

export const DEFAULT_PETAL_COUNT = petalConfigs.length;
export const DEFAULT_MOB_COUNT = mobConfigs.length;

console.log("config.js loaded", petalConfigs.length, "petals", mobConfigs.length, "mobs.");

export const randomPossiblePetal = (rarity) => {
    const possible = [];

    mobConfigs.forEach(mob => {
        mob.drops.forEach(drop => {
            if (drop.index > -1 && rarity >= drop.minRarity) {
                possible.push(drop.index);
            }
        });
    });

    return possible[Math.random() * possible.length | 0];
}