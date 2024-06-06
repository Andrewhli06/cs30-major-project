# Major Project Proposal

## Description
Awesome Tanks-esque game (inspiration: Cool Math Games)
- Awesome Tanks is a well known 2D shooter game on Cool Math Games, with 15 unique levels.
  The primary objective of this game is to destroy all the enemy tank spawners without dying.
  Through killing enemies and breaking crates, the player earns gold, which they can then spend
  on upgrading specific attributes (armor, visibility, turret speed, movement speed). The character movement
  is standard WASD, shooting requires mouse click, and the numbers 1-6 are used to switch weapons.

## Needs to Have List
- Sound effects/background music
- Level selection screen
- Basic movement
  - WASD (up, down, left, right) ✓
  - rotate character orientation based on mouse location ✓
- Shooting
  - shooting in the direction of the cursor based on player location ✓
  - stationary enemy turrets that shoot at player upon contact ✓
  - bullets that disappear after a certain distance ✓
- Level layouts
  - various "cell" types (indestructible wall, destructible wall, turrets)

## Nice to Have List
- Achievements/stats
- An overheat feature for the gun
- Explosive canisters (AOE damage)
- Healthbars for everything (blocks, enemies, player)
- Freezing ability (freezes the enemy for a certain time after player has picked up the object)
- Enemies track player (hard) - Pathfinding algorithm
- Spawn enemies periodically until the spawner is broken, shoot when they see player - Line of sight algorithm
- All start screens and/or choice screens - UI improvement
- Implement optional upgrades to your tank (armor, visibility, turret speed, movement speed)
- Implement choice of weapons (minigun, shotgun, ricochet, cannon, rockets, laser)
