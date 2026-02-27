import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class MouseSprites {
  static create(scene: Phaser.Scene): void {
    const frameWidth = 12; // Ultra tiny frame
    const frameHeight = 12;

    // Helper function to draw a tiny sweet mouse
    const drawMouse = (graphics: Phaser.GameObjects.Graphics, frame: number, direction: string, offsetX: number = 0) => {
      // Mouse colors - softer, sweeter palette
      const mouseGray = 0xb8a8d8; // Soft lavender-gray fur
      const mousePink = 0xffc0d9; // Softer pink for features
      const mouseDark = 0x9080a0; // Soft purple-gray shadow
      const eyeColor = 0x2d2d2d; // Warm black
      const eyeHighlight = 0xffffff; // Bright eyes

      let bodyBob = 0;
      let earWiggle = 0;

      // Animation offsets
      if (frame === 1) {
        bodyBob = 0.5;
        earWiggle = 1;
      }
      if (frame === 2) {
        bodyBob = 0;
        earWiggle = -1;
      }

      if (direction === 'down') {
        // Shadow underneath
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.3);
        graphics.fillEllipse(offsetX + 6, 10, 5, 1.8);

        // Tail - thin and realistic
        graphics.lineStyle(0.6, mousePink);
        graphics.beginPath();
        graphics.moveTo(offsetX + 6, 7);
        graphics.lineTo(offsetX + 5.5, 8.5);
        graphics.lineTo(offsetX + 5, 10);
        graphics.strokePath();

        // Body - elongated horizontal oval (realistic mouse on all fours)
        graphics.fillStyle(mouseGray);
        graphics.fillEllipse(offsetX + 6, 6.5, 3, 2.2);

        // Body shading
        graphics.fillStyle(mouseDark, 0.25);
        graphics.fillEllipse(offsetX + 6, 7, 2, 1.5);

        // Head - smaller, forward-facing
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 6, 4, 1.5);

        // Ears - small and realistic
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 5 + earWiggle * 0.3, 3, 0.8);
        graphics.fillCircle(offsetX + 7 - earWiggle * 0.3, 3, 0.8);

        // Ear inner
        graphics.fillStyle(mousePink, 0.6);
        graphics.fillCircle(offsetX + 5 + earWiggle * 0.3, 3, 0.4);
        graphics.fillCircle(offsetX + 7 - earWiggle * 0.3, 3, 0.4);

        // Nose - tiny realistic
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 6, 4.8, 0.3);

        // Eyes - small realistic beady eyes
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 5.2, 3.8, 0.5);
        graphics.fillCircle(offsetX + 6.8, 3.8, 0.5);

        // Eye shine - subtle
        graphics.fillStyle(eyeHighlight, 0.8);
        graphics.fillCircle(offsetX + 5.3, 3.7, 0.2);
        graphics.fillCircle(offsetX + 6.9, 3.7, 0.2);

        // Four legs - realistic positioning
        graphics.fillStyle(mousePink);
        // Front legs
        graphics.fillCircle(offsetX + 4.8, 8.5 + bodyBob, 0.3);
        graphics.fillCircle(offsetX + 7.2, 8.5 + bodyBob, 0.3);
        // Back legs
        graphics.fillCircle(offsetX + 4.5, 9 + bodyBob, 0.35);
        graphics.fillCircle(offsetX + 7.5, 9 + bodyBob, 0.35);
      }

      if (direction === 'up') {
        // Tiny shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.25);
        graphics.fillEllipse(offsetX + 6, 10, 4, 1.5);

        // Tail (visible behind)
        graphics.lineStyle(0.8, mousePink);
        graphics.beginPath();
        graphics.moveTo(offsetX + 6, 7);
        graphics.lineTo(offsetX + 7, 9);
        graphics.lineTo(offsetX + 8, 11);
        graphics.strokePath();

        // Body
        graphics.fillStyle(mouseGray);
        graphics.fillEllipse(offsetX + 6, 7, 2.5, 3.5);

        // Soft shading
        graphics.fillStyle(mouseDark, 0.2);
        graphics.fillEllipse(offsetX + 5.5, 7.5, 1.2, 2);

        // Head - big round
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 6, 4.5, 2.2);

        // Ears (visible from back)
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 4.5 + earWiggle, 3, 1.2);
        graphics.fillCircle(offsetX + 7.5 - earWiggle, 3, 1.2);

        // Big sweet eyes
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 5, 4.5, 0.7);
        graphics.fillCircle(offsetX + 7, 4.5, 0.7);

        // Eye shine
        graphics.fillStyle(eyeHighlight, 0.9);
        graphics.fillCircle(offsetX + 5.2, 4.3, 0.25);
        graphics.fillCircle(offsetX + 7.2, 4.3, 0.25);
      }

      if (direction === 'left') {
        // Tiny shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.25);
        graphics.fillEllipse(offsetX + 6, 10, 4, 1.5);

        // Tail
        graphics.lineStyle(0.8, mousePink);
        graphics.beginPath();
        graphics.moveTo(offsetX + 7.5, 7);
        graphics.lineTo(offsetX + 9, 8);
        graphics.lineTo(offsetX + 10.5, 9);
        graphics.strokePath();

        // Body
        graphics.fillStyle(mouseGray);
        graphics.fillEllipse(offsetX + 6, 7, 3.5, 2.5);

        // Soft shading
        graphics.fillStyle(mouseDark, 0.2);
        graphics.fillEllipse(offsetX + 6.5, 7, 2, 1.2);

        // Head - round and big
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 4.5, 5, 2);

        // Snout (tiny)
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 3.2, 5.5, 0.8);

        // Nose
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 2.8, 5.5, 0.35);

        // Ear (sweet and fluffy)
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 4.5, 3.2, 1.1);
        graphics.fillStyle(mousePink, 0.6);
        graphics.fillCircle(offsetX + 4.5, 3.2, 0.6);

        // Big sweet eye
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 4.5, 4.5, 0.7);
        // Eye shine (prominent)
        graphics.fillStyle(eyeHighlight, 0.9);
        graphics.fillCircle(offsetX + 4.8, 4.3, 0.25);

        // Paws
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 4.5, 9.5 + bodyBob, 0.35);
        graphics.fillCircle(offsetX + 6.5, 9.5 + bodyBob, 0.35);
      }

      if (direction === 'right') {
        // Tiny shadow
        graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.25);
        graphics.fillEllipse(offsetX + 6, 10, 4, 1.5);

        // Tail
        graphics.lineStyle(0.8, mousePink);
        graphics.beginPath();
        graphics.moveTo(offsetX + 4.5, 7);
        graphics.lineTo(offsetX + 3, 8);
        graphics.lineTo(offsetX + 1.5, 9);
        graphics.strokePath();

        // Body
        graphics.fillStyle(mouseGray);
        graphics.fillEllipse(offsetX + 6, 7, 3.5, 2.5);

        // Soft shading
        graphics.fillStyle(mouseDark, 0.2);
        graphics.fillEllipse(offsetX + 5.5, 7, 2, 1.2);

        // Head - round and big
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 7.5, 5, 2);

        // Snout (tiny)
        graphics.fillStyle(mouseGray);
        graphics.fillCircle(offsetX + 8.8, 5.5, 0.8);

        // Nose
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 9.2, 5.5, 0.35);

        // Ear (sweet and fluffy)
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 7.5, 3.2, 1.1);
        graphics.fillStyle(mousePink, 0.6);
        graphics.fillCircle(offsetX + 7.5, 3.2, 0.6);

        // Big sweet eye
        graphics.fillStyle(eyeColor);
        graphics.fillCircle(offsetX + 7.5, 4.5, 0.7);
        // Eye shine (prominent)
        graphics.fillStyle(eyeHighlight, 0.9);
        graphics.fillCircle(offsetX + 7.2, 4.3, 0.25);

        // Paws
        graphics.fillStyle(mousePink);
        graphics.fillCircle(offsetX + 5.5, 9.5 + bodyBob, 0.35);
        graphics.fillCircle(offsetX + 7.5, 9.5 + bodyBob, 0.35);
      }
    };

    // Create texture for walk animations
    const textureKey = 'mouse';
    const texture = scene.textures.createCanvas(textureKey, frameWidth * 3 * 4, frameHeight)!;
    const canvas = texture.getSourceImage() as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!;
    const graphics = scene.add.graphics();

    // Generate all frames
    const directions = ['down', 'up', 'left', 'right'];
    directions.forEach((direction, dirIndex) => {
      for (let frame = 0; frame < 3; frame++) {
        graphics.clear();
        drawMouse(graphics, frame, direction);
        
        const x = (dirIndex * 3 + frame) * frameWidth;
        graphics.generateTexture(textureKey + `-temp-${dirIndex}-${frame}`, frameWidth, frameHeight);
        const tempTexture = scene.textures.get(textureKey + `-temp-${dirIndex}-${frame}`).getSourceImage() as HTMLCanvasElement;
        ctx.drawImage(tempTexture, x, 0);
        scene.textures.remove(textureKey + `-temp-${dirIndex}-${frame}`);
      }
    });

    graphics.destroy();
    texture.refresh();

    // Add frames to the texture
    for (let i = 0; i < 12; i++) {
      texture.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
    }

    // Create animations
    scene.anims.create({
      key: 'mouse-walk-down',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 0, end: 2 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'mouse-walk-up',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 3, end: 5 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'mouse-walk-left',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 6, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'mouse-walk-right',
      frames: scene.anims.generateFrameNumbers(textureKey, { start: 9, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
  }
}
