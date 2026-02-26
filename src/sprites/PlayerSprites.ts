import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export interface CharacterCustomization {
  skinColor?: number;
  hairColor?: number;
  hairStyle?: 'bald' | 'short' | 'long' | 'ponytail';
  cloakColor?: number;
  armorColor?: number;
  bootColor?: number;
  eyeColor?: number;
}

export class PlayerSprites {
  static create(scene: Phaser.Scene, customization?: CharacterCustomization): void {
    const frameWidth = 32;
    const frameHeight = 32;

    // Helper function to draw a human character
    const drawPlayer = (graphics: Phaser.GameObjects.Graphics, frame: number, direction: string, offsetX: number = 0, custom?: CharacterCustomization) => {
      // Dark fantasy character colors with customization support
      const skinColor = custom?.skinColor ?? DarkFantasyPalette.paleFlesh;
      const skinShadow = DarkFantasyPalette.leatherBrown;
      const cloakColor = custom?.cloakColor ?? DarkFantasyPalette.cloakGray;
      const cloakShadow = DarkFantasyPalette.darkStone;
      const armorColor = custom?.armorColor ?? DarkFantasyPalette.leatherBrown;
      const armorHighlight = 0xa08662;
      const bootColor = custom?.bootColor ?? DarkFantasyPalette.darkStone;
      const hairColor = custom?.hairColor ?? DarkFantasyPalette.oldWood;
      const hairStyle = custom?.hairStyle ?? 'bald';
      const eyeColor = custom?.eyeColor ?? DarkFantasyPalette.mysticTeal;

      let legOffset = 0;

      // Leg animation: alternating legs
      if (frame === 1) legOffset = 2;
      if (frame === 2) legOffset = -2;

      if (direction === 'down') {
        // Cloak shadow base
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.4);
        graphics.fillEllipse(offsetX + 16, 30, 16, 5);

        // Cloak (back) with flowing shape
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 9, 15, 14, 14);
        graphics.fillCircle(offsetX + 10, 28, 3);
        graphics.fillCircle(offsetX + 22, 28, 3);
        
        // Cloak shadows for depth
        graphics.fillStyle(cloakShadow, 0.6);
        graphics.fillRect(offsetX + 10, 18, 3, 9);
        graphics.fillRect(offsetX + 19, 18, 3, 9);
        
        // Legs - add walking animation
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 10, 20 + legOffset, 4, 8);
        graphics.fillRect(offsetX + 18, 20 - legOffset, 4, 8);
        
        // Leg shading
        graphics.fillStyle(DarkFantasyPalette.oldWood, 0.5);
        graphics.fillRect(offsetX + 12, 21 + legOffset, 2, 6);
        graphics.fillRect(offsetX + 20, 21 - legOffset, 2, 6);
        
        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 10, 27 + legOffset, 4, 4);
        graphics.fillRect(offsetX + 18, 27 - legOffset, 4, 4);
        
        // Boot highlights
        graphics.fillStyle(DarkFantasyPalette.stoneGray, 0.4);
        graphics.fillRect(offsetX + 10, 27 + legOffset, 2, 1);
        graphics.fillRect(offsetX + 18, 27 - legOffset, 2, 1);

        // Body (armor) with layered detail
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 14, 10, 9);
        
        // Armor details - belt and straps
        graphics.fillStyle(DarkFantasyPalette.oldWood);
        graphics.fillRect(offsetX + 11, 21, 10, 2);
        graphics.fillRect(offsetX + 15, 14, 2, 9);
        
        // Armor highlights
        graphics.fillStyle(armorHighlight, 0.5);
        graphics.fillRect(offsetX + 11, 14, 4, 2);
        graphics.fillRect(offsetX + 17, 14, 4, 2);

        // Arms with shading
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 8, 15, 3, 8);
        graphics.fillRect(offsetX + 21, 15, 3, 8);
        
        // Arm shadows
        graphics.fillStyle(skinShadow, 0.4);
        graphics.fillRect(offsetX + 9, 16, 2, 6);
        graphics.fillRect(offsetX + 22, 16, 2, 6);
        
        // Hands
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 9, 23, 1.8);
        graphics.fillCircle(offsetX + 23, 23, 1.8);

        // Head with better shape
        graphics.fillStyle(skinColor);
        graphics.fillEllipse(offsetX + 16, 10, 11, 12);
        
        // Face shadows for depth
        graphics.fillStyle(skinShadow, 0.3);
        graphics.fillCircle(offsetX + 16, 12, 4);
        
        // Draw hair based on style
        drawHairDown(graphics, hairColor, hairStyle, offsetX);
        
        // Eyes (glowing) with more detail
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.8);
        graphics.fillCircle(offsetX + 13.5, 10, 1.8);
        graphics.fillCircle(offsetX + 18.5, 10, 1.8);
        
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 13.5, 10, 1.2);
        graphics.fillCircle(offsetX + 18.5, 10, 1.2);
        
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(offsetX + 13, 9.5, 0.6);
        graphics.fillCircle(offsetX + 18, 9.5, 0.6);
        
        // Nose
        graphics.fillStyle(skinShadow, 0.4);
        graphics.fillCircle(offsetX + 16, 11.5, 1);

      } else if (direction === 'up') {
        // Ground shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.4);
        graphics.fillEllipse(offsetX + 16, 30, 16, 5);

        // Cloak (back flowing)
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 9, 16, 14, 13);
        graphics.fillCircle(offsetX + 10, 27, 3);
        graphics.fillCircle(offsetX + 22, 27, 3);
        
        // Cloak flow details
        graphics.fillStyle(cloakShadow, 0.5);
        graphics.fillRect(offsetX + 15, 17, 2, 11);
        
        // Legs (back view)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 21 + legOffset, 4, 8);
        graphics.fillRect(offsetX + 17, 21 - legOffset, 4, 8);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 11, 28 + legOffset, 4, 3);
        graphics.fillRect(offsetX + 17, 28 - legOffset, 4, 3);

        // Body
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 15, 10, 8);
        
        // Shoulder armor details
        graphics.fillStyle(DarkFantasyPalette.darkStone);
        graphics.fillCircle(offsetX + 12, 15, 2);
        graphics.fillCircle(offsetX + 20, 15, 2);

        // Arms raised slightly
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 8, 16, 3, 7);
        graphics.fillRect(offsetX + 21, 16, 3, 7);

        // Head (back of head)
        graphics.fillStyle(skinColor);
        graphics.fillEllipse(offsetX + 16, 10, 11, 12);
        
        // Draw hair based on style
        drawHairUp(graphics, hairColor, hairStyle, offsetX);
        
        // Ear hints
        graphics.fillStyle(skinShadow, 0.6);
        graphics.fillCircle(offsetX + 11, 10, 1.5);
        graphics.fillCircle(offsetX + 21, 10, 1.5);

      } else if (direction === 'left') {
        // Ground shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.4);
        graphics.fillEllipse(offsetX + 16, 30, 14, 5);

        // Cloak (side) flowing
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 12, 15, 9, 14);
        graphics.fillCircle(offsetX + 13, 28, 3);
        graphics.fillCircle(offsetX + 19, 28, 3);
        
        // Cloak shadows
        graphics.fillStyle(cloakShadow, 0.5);
        graphics.fillRect(offsetX + 17, 17, 3, 10);
        
        // Legs (side view with walk animation)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 13, 21 + legOffset, 5, 8);
        graphics.fillRect(offsetX + 15, 21 - legOffset, 5, 7);
        
        // Leg shading
        graphics.fillStyle(DarkFantasyPalette.oldWood, 0.5);
        graphics.fillRect(offsetX + 16, 22 + legOffset, 2, 6);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 13, 28 + legOffset, 5, 3);
        graphics.fillRect(offsetX + 15, 27 - legOffset, 5, 3);
        
        // Boot details
        graphics.fillStyle(DarkFantasyPalette.stoneGray, 0.4);
        graphics.fillRect(offsetX + 13, 28 + legOffset, 2, 1);

        // Body (armor) with detail
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 12, 14, 9, 9);
        
        // Belt
        graphics.fillStyle(DarkFantasyPalette.oldWood);
        graphics.fillRect(offsetX + 12, 21, 9, 2);
        
        // Armor shading
        graphics.fillStyle(DarkFantasyPalette.oldWood, 0.5);
        graphics.fillRect(offsetX + 17, 15, 3, 7);

        // Arm (front)
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 11, 16, 4, 7);
        
        // Arm shadow
        graphics.fillStyle(skinShadow, 0.4);
        graphics.fillRect(offsetX + 13, 17, 2, 5);
        
        // Hand
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 12, 23, 1.8);

        // Head with better shape
        graphics.fillStyle(skinColor);
        graphics.fillEllipse(offsetX + 16, 10, 10, 12);
        
        // Face shadow
        graphics.fillStyle(skinShadow, 0.3);
        graphics.fillCircle(offsetX + 17, 11, 3);
        
        // Draw hair based on style
        drawHairLeft(graphics, hairColor, hairStyle, offsetX);
        
        // Ear
        graphics.fillStyle(skinShadow, 0.6);
        graphics.fillCircle(offsetX + 12, 10, 1.5);

        // Eye (glowing) with depth
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.8);
        graphics.fillCircle(offsetX + 14.5, 10, 1.8);
        
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 14.5, 10, 1.2);
        
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(offsetX + 14, 9.5, 0.6);
        
        // Nose
        graphics.fillStyle(skinShadow, 0.5);
        graphics.fillCircle(offsetX + 13, 11, 1);

      } else if (direction === 'right') {
        // Ground shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.4);
        graphics.fillEllipse(offsetX + 16, 30, 14, 5);

        // Cloak (side) flowing
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 11, 15, 9, 14);
        graphics.fillCircle(offsetX + 13, 28, 3);
        graphics.fillCircle(offsetX + 19, 28, 3);
        
        // Cloak shadows
        graphics.fillStyle(cloakShadow, 0.5);
        graphics.fillRect(offsetX + 12, 17, 3, 10);
        
        // Legs (side view with walk animation)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 14, 21 + legOffset, 5, 8);
        graphics.fillRect(offsetX + 12, 21 - legOffset, 5, 7);
        
        // Leg shading
        graphics.fillStyle(DarkFantasyPalette.oldWood, 0.5);
        graphics.fillRect(offsetX + 14, 22 + legOffset, 2, 6);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 14, 28 + legOffset, 5, 3);
        graphics.fillRect(offsetX + 12, 27 - legOffset, 5, 3);
        
        // Boot details
        graphics.fillStyle(DarkFantasyPalette.stoneGray, 0.4);
        graphics.fillRect(offsetX + 15, 28 + legOffset, 2, 1);

        // Body (armor) with detail
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 14, 9, 9);
        
        // Belt
        graphics.fillStyle(DarkFantasyPalette.oldWood);
        graphics.fillRect(offsetX + 11, 21, 9, 2);
        
        // Armor shading
        graphics.fillStyle(DarkFantasyPalette.oldWood, 0.5);
        graphics.fillRect(offsetX + 12, 15, 3, 7);

        // Arm (front)
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 17, 16, 4, 7);
        
        // Arm shadow
        graphics.fillStyle(skinShadow, 0.4);
        graphics.fillRect(offsetX + 17, 17, 2, 5);
        
        // Hand
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 20, 23, 1.8);

        // Head with better shape
        graphics.fillStyle(skinColor);
        graphics.fillEllipse(offsetX + 16, 10, 10, 12);
        
        // Face shadow
        graphics.fillStyle(skinShadow, 0.3);
        graphics.fillCircle(offsetX + 15, 11, 3);
        
        // Draw hair based on style
        drawHairRight(graphics, hairColor, hairStyle, offsetX);
        
        // Ear
        graphics.fillStyle(skinShadow, 0.6);
        graphics.fillCircle(offsetX + 20, 10, 1.5);

        // Eye (glowing) with depth
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.8);
        graphics.fillCircle(offsetX + 17.5, 10, 1.8);
        
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 17.5, 10, 1.2);
        
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(offsetX + 18, 9.5, 0.6);
        
        // Nose
        graphics.fillStyle(skinShadow, 0.5);
        graphics.fillCircle(offsetX + 19, 11, 1);
      }
    };

    // Hair drawing functions for different styles
    const drawHairDown = (graphics: Phaser.GameObjects.Graphics, hairColor: number, hairStyle: string, offsetX: number) => {
      if (hairStyle === 'bald') return;
      
      if (hairStyle === 'short') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 12, 6, 2.5);
        graphics.fillCircle(offsetX + 20, 6, 2.5);
        graphics.fillRect(offsetX + 12, 5, 8, 2);
      } else if (hairStyle === 'long') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 11, 6, 3.5);
        graphics.fillCircle(offsetX + 21, 6, 3.5);
        graphics.fillRect(offsetX + 11, 5, 10, 4);
        graphics.fillCircle(offsetX + 10, 11, 2);
        graphics.fillCircle(offsetX + 22, 11, 2);
      } else if (hairStyle === 'ponytail') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 12, 6, 2.5);
        graphics.fillCircle(offsetX + 20, 6, 2.5);
        graphics.fillRect(offsetX + 12, 5, 8, 2);
      }
    };

    const drawHairUp = (graphics: Phaser.GameObjects.Graphics, hairColor: number, hairStyle: string, offsetX: number) => {
      if (hairStyle === 'bald') return;
      
      if (hairStyle === 'short') {
        graphics.fillStyle(hairColor);
        graphics.fillEllipse(offsetX + 16, 6, 9, 6);
      } else if (hairStyle === 'long') {
        graphics.fillStyle(hairColor);
        graphics.fillEllipse(offsetX + 16, 6, 11, 7);
        graphics.fillCircle(offsetX + 11, 9, 2.5);
        graphics.fillCircle(offsetX + 21, 9, 2.5);
      } else if (hairStyle === 'ponytail') {
        graphics.fillStyle(hairColor);
        graphics.fillEllipse(offsetX + 16, 6, 9, 6);
        graphics.fillCircle(offsetX + 16, 12, 2);
        graphics.fillCircle(offsetX + 16, 14, 2.5);
        graphics.fillCircle(offsetX + 16, 16, 2);
      }
    };

    const drawHairLeft = (graphics: Phaser.GameObjects.Graphics, hairColor: number, hairStyle: string, offsetX: number) => {
      if (hairStyle === 'bald') return;
      
      if (hairStyle === 'short') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 14, 6, 3);
        graphics.fillCircle(offsetX + 17, 5, 2.5);
        graphics.fillRect(offsetX + 13, 5, 5, 3);
      } else if (hairStyle === 'long') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 13, 6, 3.5);
        graphics.fillCircle(offsetX + 17, 5, 3);
        graphics.fillRect(offsetX + 12, 5, 6, 4);
        graphics.fillCircle(offsetX + 12, 11, 2);
      } else if (hairStyle === 'ponytail') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 14, 6, 3);
        graphics.fillCircle(offsetX + 17, 5, 2.5);
        graphics.fillRect(offsetX + 13, 5, 5, 3);
        graphics.fillCircle(offsetX + 19, 10, 1.8);
        graphics.fillCircle(offsetX + 20, 12, 2);
      }
    };

    const drawHairRight = (graphics: Phaser.GameObjects.Graphics, hairColor: number, hairStyle: string, offsetX: number) => {
      if (hairStyle === 'bald') return;
      
      if (hairStyle === 'short') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 18, 6, 3);
        graphics.fillCircle(offsetX + 15, 5, 2.5);
        graphics.fillRect(offsetX + 14, 5, 5, 3);
      } else if (hairStyle === 'long') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 19, 6, 3.5);
        graphics.fillCircle(offsetX + 15, 5, 3);
        graphics.fillRect(offsetX + 14, 5, 6, 4);
        graphics.fillCircle(offsetX + 20, 11, 2);
      } else if (hairStyle === 'ponytail') {
        graphics.fillStyle(hairColor);
        graphics.fillCircle(offsetX + 18, 6, 3);
        graphics.fillCircle(offsetX + 15, 5, 2.5);
        graphics.fillRect(offsetX + 14, 5, 5, 3);
        graphics.fillCircle(offsetX + 13, 10, 1.8);
        graphics.fillCircle(offsetX + 12, 12, 2);
      }
    };

    // Create sprite sheets for each direction
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(direction => {
      // Create individual frame textures
      for (let i = 0; i < 3; i++) {
        const frameGraphics = scene.add.graphics({ x: 0, y: 0 });
        drawPlayer(frameGraphics, i, direction, 0, customization);
        frameGraphics.generateTexture(`player-${direction}-${i + 1}`, frameWidth, frameHeight);
        frameGraphics.destroy();
      }
    });
  }

  // Create custom NPC sprites with different appearance
  static createNPC(scene: Phaser.Scene, name: string, customization: CharacterCustomization): void {
    // Simply call the main create function with customization and custom texture names
    const frameWidth = 32;
    const frameHeight = 32;

    // Copy the main create logic but use custom name for textures
    const drawPlayer = (graphics: Phaser.GameObjects.Graphics, frame: number, direction: string, offsetX: number = 0) => {
      // This function body would be the same as in create() above
      // For now, we'll use a simpler approach - just create with PlayerSprites.create internally
    };

    const directions = ['down', 'up', 'left', 'right'];
    
    // Temporarily create player sprites with customization
    PlayerSprites.create(scene, customization);
    
    // Copy textures to NPC-specific names
    directions.forEach(direction => {
      for (let i = 0; i < 3; i++) {
        const sourceKey = `player-${direction}-${i + 1}`;
        const targetKey = `${name}-${direction}-${i + 1}`;
        
        // Clone the texture
        const texture = scene.textures.get(sourceKey);
        if (texture) {
          const source = texture.getSourceImage();
          scene.textures.addImage(targetKey, source as HTMLImageElement);
        }
      }
    });
  }

  static createAnimations(scene: Phaser.Scene): void {
    // Walk down animation
    scene.anims.create({
      key: 'walk-down',
      frames: [
        { key: 'player-down-1' },
        { key: 'player-down-2' },
        { key: 'player-down-3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Walk up animation
    scene.anims.create({
      key: 'walk-up',
      frames: [
        { key: 'player-up-1' },
        { key: 'player-up-2' },
        { key: 'player-up-3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Walk left animation
    scene.anims.create({
      key: 'walk-left',
      frames: [
        { key: 'player-left-1' },
        { key: 'player-left-2' },
        { key: 'player-left-3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    // Walk right animation
    scene.anims.create({
      key: 'walk-right',
      frames: [
        { key: 'player-right-1' },
        { key: 'player-right-2' },
        { key: 'player-right-3' }
      ],
      frameRate: 8,
      repeat: -1
    });
  }
}
