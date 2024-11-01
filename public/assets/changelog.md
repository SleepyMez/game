# Update (10/31/2024):
- Added 2 new petals: Leech Egg (dev-only) and Hornet Egg (dev-only)
- Added a new mob for Halloween: Pumpkin
- Added a new petal for Halloween: Candy
- Leeches will now give you loot if you attack the segments instead of the head
- Hornets now render playerYellow when they are a player summon
- Wilt summons now render playerYellow when they are a player summon
- Evil Centipedes now drop Grapes
- Spirits can now drop Candy
- Egg has been renamed to Beetle Egg
- Halloween Terrain is now purely dark gray instead of a mix of brown and gray
- Pumpkins and Spirits can now spawn in the Halloween biome

# Update (10/28/2024):
- Added a scary familiar biome: Dark Forest!
- Added some new mobs: Wasp, Shrub, Stickbug, and Hell Centipede!
- Added some new petals: Shrub, Branch, and Grapes
- Added two mobs for Halloween: Spirit and the Wilt!
- Added a new petal for Halloween: Lantern!
- Moths will now run away upon being aggrod
- Ant Hole, Fire Ant Hole, and Termite Mound now have pushabilities of 0
- Cactus, Dandelion, and Termite Overmind now have pushabilities of 0.5
- Hell Yellowjacket, Hell Spider, Hell Beetle, Demon, Queen Ant, and Queen Fire Ant, now have pushabilities of 0.8
- Sandstorms now have random sizes
- Spiders and Hell Spiders can now lay webs
- Shiny Ladybug now has neutral AI instead of aggressive
- Despawned mobs will no longer drop xp and loot
- Ancient+ mobs now have kill messages
- Splits Petals are now 1.5x larger
- Peas are now 1x as big instead of 1.3x
- web.mob.launched (Web Projectile) now ignores walls
- Nerfed third eye range significantly to make it more useable
- Nerfed the size of web.mob.launched (Web Projectile) by around 50%
- Players no longer collide with other summons
- Summons have a 3x health buff
- Player webs (changed to web.player.launched from web.mob.launched) are now yellow
- Fixed a bug that caused Yggdrasil to not trigger upon dying to anything other than normal damage
- Pre-Game Menu Buttons are now a transparent black
- The menu background will now reflect the biome that the user previously used for a lobby

# Update (10/20/2024):
- Queen Ant now has aggressive AI instead of neutral
- Worker Fire Ant now has neutral AI instead of aggressive
- Worker Termite now has neutral AI instead of aggressive
- Petals that use "shootsOut" now shoot upon defending
- Petals that use "shootsOut" don't go as far when shot while defending 
- Petals that use "shootsOut" no longer scale with player size
- Petals now render under entities and petal drops
- Added a new petal: Armor! It makes you take a lot less damage, but make you lose max hp
- Extra Health can now show negative stat values

# Update (10/16/2024):
- Did a thing
- Did another thing
- Slightly nerfed progression

# Update (08/25/2024):
- Fixed a few bugs with analytics
- Because people can't let a nice thing be, I had to add the slur filter to the lobby creation...
- Size increase no longer makes your petal orbit increase
- Fixed Starfish not having a description
- Buffed Starfish heal slightly
- Buffed Yucca and Leaf
- Removed pentagram spell from Deity petal
- Nerfed Yggdrasil's reload to 45 seconds
- Yggdrasil can no longer be destroyed when active
- Cactus, Dirt, Rose, Egg, Stick, Dahlia, Primrose, Fire Spellbook, Powder, Ant Egg, Magnet, Yggdrasil, Sponge, Shell, and Lightbulb now huddle close to the player and are not affected by attacking
- Nerfed Dust
- Fixed an issue with private lobbies

# Update (08/22/2024):
- Expect progress on game to slow, I am going to college
- Nerfed Soldier & Queen Fire ant speed slightly
- Queen/Overmind spawned eggs now take longer to hatch, and spawn less often
- Buffed all of Primrose's healing parameters
- Testing enabling perMessageDeflate on websocket connections for both the router and bun server
- Added another metric to the client debug data for bandwidth per second (measured in KB)

# Update (08/20/2024):
- Added chat, use it wisely...
- Small balance changes
- Redid the Level GUI to make it more familiar to florr players, will change soon
- Changed the facial expression slightly
- Fixed a bug where mobs spawned from Queen Ants would mess up some stuff
- Termite Overmind now spawns Soldier Termites when attacking
- Added a better major slur filter. But please, just be civil.

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