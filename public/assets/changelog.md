# Update (08/20/2024):
- Added chat, use it wisely...
- Small balance changes
- Redid the Level GUI to make it more familiar to florr players, will change soon
- Changed the facial expression slightly
- Fixed a bug where mobs spawned from Queen Ants would mess up some stuff
- Termite Overmind now spawns Soldier Termites when attacking

# Update (08/18/2024):
- Fixed a bug with Rice and 0 reload petals
- Added an option to enable/disable hitboxes
- Rewrote the routing server using Bun's APIs and runtimes
- Segmented mobs can now coil upon themselves
- Started experimenting with running the Bun router on an ExtraVM server (WARNING: This will invalidate any node/bun game instance)
- Fixed some small issues with health of certain petals
- Doubled Rice's damage output while removing its health component, making it a one-hit stooge

# Update (08/09/2024):
- Added a HIGHLY experimental new gamemode with terrain rather than just a plain map
- Nerfed Evil Players and changed their colors
- You lose less XP when you die
- Buffed Iris
- Added Jelly
- Nerfed Ant Eggs
- Added naturally spawning ant eggs that hatch into ants or termites
- Queen Ant and Queen Fire Ant now lay eggs while attacking
- Added Evil Ladybug
- Added Shiny Ladybug
- Changed up Corn's stats
- Added Angelic Ladybug
- Added a slight display for petal health and recharging
- Added Yggdrasil, thank you to @flarm for the rendering code for it
- Added Glass
- Normalized some rendering conventions for petals and mobs
- Kinda added Dandelion, still needs some tweaks
- Added Sponge the mob and Sponge the petal
- Added Bubble mob and petal
- Added Air petal
- Added Starfish mob and petal
- Added Shell mob and petal
- Added Pearl petal
- Added Leech mob and Fang petal
- Added Maggot and its drops
- Added Firefly and its drops
- Special thanks for @flarm for the render code for Lightbulb
- Added Fly
- Added Moth
- Added Bumblebee
- Changed how petal motion works
- Added biome selection
- Added a placeholder hell biome

# Update (08/04/2024):
- Changed dirt from multiplication% to addition size
- Reworked termite stats and sizes of ants
- Buffed Demon
- Ant holes are now more rare and ants can no longer spawn without a hole to acompany them
- Fixed invulnerability screwing with damage reflection
- Magnet now grounds Lightning
- Lightning is now more accurage against players
- Added angry flowers
- Added some more support for the modding API, see info at https://floof.eparker.dev/moddingAPI/
- Added ECONNRESET error handling
- You now lose some XP when you die
- Damage Reflection now only reflects the real damage done. For example, if a mob has 8 health remaining and your petal does 25 damage, only 8 damage will be reflected back upon you.
- Added some menus, as well as an options menu. These options include Mouse Movement, as many people have requested.
- Redid how player names and info is displayed
- Fixed Yucca not healing on defense

# Update (08/01/2024):
- Fixed a crash bug for node instances and a source of rare errors on the builds for workers
- The level bar and the minimap no longer display when not connected to the server
- Fixed menus being shown in game by pressing TAB
- Buffed chances of getting higher loot from mobs
- Added keybinds to change and destroy petals
- Changed how rarities progress in waves
- Fixed Unique Cactus mob not rendering in
- Nerfed Lightning
- Fixed a very annoying host crash, thank you to @Xilith for helping with this process
- Implemented a basic recovery system using rolling UUIDs to avoid collisions and keep things fresh. You can reserve a UUID for up to 24 hours before it goes away. If you rejoin with the same UUID before the 24 hour reservation is up, it will be extended for another 24 hours. This is all handled automatically, however there is a rate limit per IP for creating new UUIDs. If you leave a lobby accidentally or lose connection, provided the lobby still exists, you can rejoin and keep your player (if it is still alive), your slots, secondary slots, and level data.
- All mob projectiles have been nerfed slightly, while making their range extend with tier
- Nerfed Demon's parameters
- Sandstorm now drops Powder
- Added Baby Ant, Worker Ant, Soldier Ant, Queen Ant and Ant Hole
- Added the corresponding Fire Ants and Termites to the standard ants
- Buffed Egg droprate from Beetle 15% -> 22.5%
- Your friendly mobs no longer push you around
- Mob names now render above the health bar to make the text have space to be 
- Added Magnet
- Added Primrose's ability to the petal info card
- Buffed Third Eye drop chance (Mythic+) 1% -> 2.5%
- Buffed Fire Spellbook drop chance 1.5% -> 3%

# Patch (07/29/2024):
- In FFA and Teams, up to leg mobs can spawn maybe a rare mythic idk
- Bug fixes
- More dev hax

# Update (07/29/2024):
- Bone can only stack up to 60% damage reduction in total
- Fixed wearables bug, thank you to @phantomfr for finding and reporting it to me
- Added Dahlia
- Added Primrose
- Added Spellbook
- Faster now drops from Spider
- Added proper error handling to the routing server