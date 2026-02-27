import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class FoxSprites {
  static create(scene: Phaser.Scene): void {
    const frameWidth = 32;
    const frameHeight = 32;

    // Helper function to draw a fox
    const drawFox = (graphics: Phaser.GameObjects.Graphics, frame: number, direction: string, offsetX: number = 0) => {
      // Fox colors
      const foxOrange = 0xd4753e; // Rusty orange fur
      const foxWhite = 0xf5e6d3; // Cream/white chest and muzzle
      const foxDark = 0x8b4513; // Dark brown/black for ears, legs, tail tip
      const eyeColor = 0x2d5016; // Dark green eyes
      const noseColor = 0x1a1a1a; // Black nose

      let bodyOffset = 0;
      let tailWag = 0;

      // Animation offsets
      if (frame === 1) {
        bodyOffset = 1;
        tailWag = 2;
      }
      if (frame === 2) {
        bodyOffset = 0;
        tailWag = -2;
      }

      if (direction === 'down') {
        // Shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.3);
        graphics.fillEllipse(offsetX + 16, 28, 14, 4);

        // Tail (behind body)
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 16 + tailWag, 24);
        graphics.lineTo(offsetX + 12 + tailWag, 28);
        graphics.lineTo(offsetX + 10 + tailWag, 30);
        graphics.lineTo(offsetX + 14 + tailWag, 30);
        graphics.lineTo(offsetX + 18 + tailWag, 26);
        graphics.closePath();
        graphics.fillPath();

        // Tail tip (white/dark)
        graphics.fillStyle(foxWhite);
        graphics.fillCircle(offsetX + 11 + tailWag, 30, 2);

        // Body
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 16, 20 + bodyOffset, 10, 8);

        // Legs (front)
        graphics.fillStyle(foxDark);
        graphics.fillRect(offsetX + 12, 24 + bodyOffset, 2, 5);
        graphics.fillRect(offsetX + 18, 24 + bodyOffset, 2, 5);

        // Paws
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 13, 29 + bodyOffset, 1.5);
        graphics.fillCircle(offsetX + 19, 29 + bodyOffset, 1.5);

        // Head
        graphics.fillStyle(foxOrange);
        graphics.fillCircle(offsetX + 16, 15, 6);

        // Ears
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 11, 12);
        graphics.lineTo(offsetX + 13, 9);
        graphics.lineTo(offsetX + 14, 12);
        graphics.closePath();
        graphics.fillPath();

        graphics.beginPath();
        graphics.moveTo(offsetX + 21, 12);
        graphics.lineTo(offsetX + 19, 9);
        graphics.lineTo(offsetX + 18, 12);
        graphics.closePath();
        graphics.fillPath();

        // Ear tips (dark)
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 12.5, 10, 1);
        graphics.fillCircle(offsetX + 19.5, 10, 1);

        // Muzzle (white)
        graphics.fillStyle(foxWhite);
        graphics.fillEllipse(offsetX + 16, 17, 4, 3);

        // Nose
        graphics.fillStyle(noseColor);
        graphics.fillCircle(offsetX + 16, 17, 1);

        // Eyes
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 13, 14, 1.5);
        graphics.fillCircle(offsetX + 19, 14, 1.5);

        // Eye highlights
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(offsetX + 13.5, 13.5, 0.5);
        graphics.fillCircle(offsetX + 19.5, 13.5, 0.5);
      }

      if (direction === 'up') {
        // Shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.3);
        graphics.fillEllipse(offsetX + 16, 28, 14, 4);

        // Tail (visible above body when facing up)
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 16 + tailWag, 24);
        graphics.lineTo(offsetX + 14 + tailWag, 28);
        graphics.lineTo(offsetX + 12 + tailWag, 30);
        graphics.lineTo(offsetX + 16 + tailWag, 29);
        graphics.lineTo(offsetX + 20 + tailWag, 30);
        graphics.lineTo(offsetX + 18 + tailWag, 28);
        graphics.closePath();
        graphics.fillPath();

        // Tail tip
        graphics.fillStyle(foxWhite);
        graphics.fillCircle(offsetX + 16 + tailWag, 30, 2);

        // Body
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 16, 20 + bodyOffset, 10, 8);

        // Back legs
        graphics.fillStyle(foxDark);
        graphics.fillRect(offsetX + 12, 24 + bodyOffset, 2, 5);
        graphics.fillRect(offsetX + 18, 24 + bodyOffset, 2, 5);

        // Head
        graphics.fillStyle(foxOrange);
        graphics.fillCircle(offsetX + 16, 15, 6);

        // Ears (pointy, visible from back)
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 11, 13);
        graphics.lineTo(offsetX + 13, 9);
        graphics.lineTo(offsetX + 14, 12);
        graphics.closePath();
        graphics.fillPath();

        graphics.beginPath();
        graphics.moveTo(offsetX + 21, 13);
        graphics.lineTo(offsetX + 19, 9);
        graphics.lineTo(offsetX + 18, 12);
        graphics.closePath();
        graphics.fillPath();

        // Ear tips (dark)
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 12.5, 10, 1);
        graphics.fillCircle(offsetX + 19.5, 10, 1);
      }

      if (direction === 'left') {
        // Shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.3);
        graphics.fillEllipse(offsetX + 16, 28, 14, 4);

        // Tail
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 8 + tailWag, 22, 6, 8);
        
        // Tail tip
        graphics.fillStyle(foxWhite);
        graphics.fillCircle(offsetX + 6 + tailWag, 22, 2);

        // Body
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 15, 20 + bodyOffset, 9, 7);

        // White chest
        graphics.fillStyle(foxWhite);
        graphics.fillEllipse(offsetX + 16, 21 + bodyOffset, 5, 4);

        // Legs
        graphics.fillStyle(foxDark);
        graphics.fillRect(offsetX + 12, 25 + bodyOffset, 2, 4);
        graphics.fillRect(offsetX + 17, 25 + bodyOffset, 2, 4);

        // Paws
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 13, 29 + bodyOffset, 1.5);
        graphics.fillCircle(offsetX + 18, 29 + bodyOffset, 1.5);

        // Head
        graphics.fillStyle(foxOrange);
        graphics.fillCircle(offsetX + 19, 15, 5);

        // Snout
        graphics.fillStyle(foxWhite);
        graphics.fillEllipse(offsetX + 22, 16, 3, 2);

        // Nose
        graphics.fillStyle(noseColor);
        graphics.fillCircle(offsetX + 23, 16, 0.8);

        // Ear
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 18, 11);
        graphics.lineTo(offsetX + 20, 8);
        graphics.lineTo(offsetX + 21, 11);
        graphics.closePath();
        graphics.fillPath();

        // Ear tip
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 19.5, 9, 1);

        // Eye
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 20, 14, 1.5);

        // Eye highlight
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(offsetX + 20.5, 13.5, 0.5);
      }

      if (direction === 'right') {
        // Shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.3);
        graphics.fillEllipse(offsetX + 16, 28, 14, 4);

        // Tail
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 24 - tailWag, 22, 6, 8);
        
        // Tail tip
        graphics.fillStyle(foxWhite);
        graphics.fillCircle(offsetX + 26 - tailWag, 22, 2);

        // Body
        graphics.fillStyle(foxOrange);
        graphics.fillEllipse(offsetX + 17, 20 + bodyOffset, 9, 7);

        // White chest
        graphics.fillStyle(foxWhite);
        graphics.fillEllipse(offsetX + 16, 21 + bodyOffset, 5, 4);

        // Legs
        graphics.fillStyle(foxDark);
        graphics.fillRect(offsetX + 13, 25 + bodyOffset, 2, 4);
        graphics.fillRect(offsetX + 18, 25 + bodyOffset, 2, 4);

        // Paws
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 14, 29 + bodyOffset, 1.5);
        graphics.fillCircle(offsetX + 19, 29 + bodyOffset, 1.5);

        // Head
        graphics.fillStyle(foxOrange);
        graphics.fillCircle(offsetX + 13, 15, 5);

        // Snout
        graphics.fillStyle(foxWhite);
        graphics.fillEllipse(offsetX + 10, 16, 3, 2);

        // Nose
        graphics.fillStyle(noseColor);
        graphics.fillCircle(offsetX + 9, 16, 0.8);

        // Ear
        graphics.fillStyle(foxOrange);
        graphics.beginPath();
        graphics.moveTo(offsetX + 14, 11);
        graphics.lineTo(offsetX + 12, 8);
        graphics.lineTo(offsetX + 11, 11);
        graphics.closePath();
        graphics.fillPath();

        // Ear tip
        graphics.fillStyle(foxDark);
        graphics.fillCircle(offsetX + 12.5, 9, 1);

        // Eye
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 12, 14, 1.5);

        // Eye highlight
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(offsetX + 11.5, 13.5, 0.5);
      }
    };

    // Create texture for walk animations
    const textureKey = 'fox';
    const texture = scene.textures.createCanvas(textureKey, frameWidth * 3 * 4, frameHeight)!;
    const canvas = texture.getSourceImage() as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const graphics = scene.add.graphics();

    // Generate all frames
    const directions = ['down', 'up', 'left', 'right'];
    directions.forEach((direction, dirIndex) => {
      for (let frame = 0; frame < 3; frame++) {
        graphics.clear();
        drawFox(graphics, frame, direction);
        
        const x = (dirIndex * 3 + frame) * frameWidth;
        graphics.generateTexture(textureKey + `-temp-${dirIndex}-${frame}`, frameWidth, frameHeight);
        const tempTexture = scene.textures.get(textureKey + `-temp-${dirIndex}-${frame}`).getSourceImage() as HTMLCanvasElement;
        ctx.drawImage(tempTexture, x, 0);
        scene.textures.remove(textureKey + `-temp-${dirIndex}-${frame}`);
      }
    });

    graphics.destroy();
    texture.refresh();

    // Create animations
    scene.anims.create({
      key: 'fox-walk-down',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 0, end: 2 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'fox-walk-up',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 3, end: 5 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'fox-walk-left',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 6, end: 8 }),
      frameRate: 8,
      repeat: -1
    });

    scene.anims.create({
      key: 'fox-walk-right',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 9, end: 11 }),
      frameRate: 8,
      repeat: -1
    });
  }
}
