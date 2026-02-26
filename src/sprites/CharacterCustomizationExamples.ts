import { DarkFantasyPalette } from '../colors';
import { CharacterCustomization, PlayerSprites } from './PlayerSprites';

/**
 * Example customization presets for creating different NPCs
 */

// Default player (bald with leather armor)
export const PlayerDefault: CharacterCustomization = {
  skinColor: DarkFantasyPalette.paleFlesh,
  hairStyle: 'bald',
  hairColor: DarkFantasyPalette.oldWood,
  cloakColor: DarkFantasyPalette.cloakGray,
  armorColor: DarkFantasyPalette.leatherBrown,
  bootColor: DarkFantasyPalette.darkStone,
  eyeColor: DarkFantasyPalette.mysticTeal,
};

// Village guard with short hair
export const VillageGuard: CharacterCustomization = {
  skinColor: DarkFantasyPalette.leatherBrown,
  hairStyle: 'short',
  hairColor: DarkFantasyPalette.darkBark,
  cloakColor: 0x4a5462,
  armorColor: DarkFantasyPalette.darkStone,
  bootColor: DarkFantasyPalette.shadowGreen,
  eyeColor: DarkFantasyPalette.bloodRed,
};

// Merchant with long hair
export const Merchant: CharacterCustomization = {
  skinColor: DarkFantasyPalette.paleFlesh,
  hairStyle: 'long',
  hairColor: DarkFantasyPalette.earthBrown,
  cloakColor: DarkFantasyPalette.leatherBrown,
  armorColor: DarkFantasyPalette.earthBrown,
  bootColor: DarkFantasyPalette.oldWood,
  eyeColor: DarkFantasyPalette.torchGlow,
};

// Ranger with ponytail
export const Ranger: CharacterCustomization = {
  skinColor: DarkFantasyPalette.leatherBrown,
  hairStyle: 'ponytail',
  hairColor: DarkFantasyPalette.darkBark,
  cloakColor: DarkFantasyPalette.forestGreen,
  armorColor: DarkFantasyPalette.oldWood,
  bootColor: DarkFantasyPalette.darkBark,
  eyeColor: DarkFantasyPalette.darkGrass,
};

// Wizard (bald with mystical appearance)
export const Wizard: CharacterCustomization = {
  skinColor: 0xe0d0c0,
  hairStyle: 'bald',
  hairColor: DarkFantasyPalette.moonlight,
  cloakColor: 0x2a1a3a,
  armorColor: 0x3a2a4a,
  bootColor: DarkFantasyPalette.shadowGreen,
  eyeColor: DarkFantasyPalette.mysticTeal,
};

// Blacksmith (short dark hair)
export const Blacksmith: CharacterCustomization = {
  skinColor: 0xb08070,
  hairStyle: 'short',
  hairColor: DarkFantasyPalette.shadowGreen,
  cloakColor: DarkFantasyPalette.darkBark,
  armorColor: DarkFantasyPalette.oldWood,
  bootColor: DarkFantasyPalette.darkStone,
  eyeColor: DarkFantasyPalette.torchGlow,
};

/**
 * Example usage in GameScene:
 * 
 * In preload():
 * PlayerSprites.create(this); // Create player with default customization
 * 
 * // Create NPCs with different appearances:
 * PlayerSprites.createNPC(this, 'guard', VillageGuard);
 * PlayerSprites.createNPC(this, 'merchant', Merchant);
 * PlayerSprites.createNPC(this, 'ranger', Ranger);
 * 
 * In create():
 * const player = this.physics.add.sprite(400, 300, 'player-down-1');
 * const guard = this.physics.add.sprite(500, 300, 'guard-down-1');
 * const merchant = this.physics.add.sprite(600, 300, 'merchant-down-1');
 * 
 * // Or create player with custom appearance:
 * PlayerSprites.create(this, {
 *   skinColor: 0xfad6b8,
 *   hairStyle: 'long',
 *   hairColor: 0x8b6914,
 *   cloakColor: 0x1a4a2e,
 *   armorColor: 0x71413b,
 *   bootColor: 0x4a5462,
 *   eyeColor: 0x20d6c7
 * });
 */
