import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class HouseSprites {
  static create(scene: Phaser.Scene): void {
    const houseGraphics = scene.add.graphics({ x: 0, y: 0 });
    
    // Walls
    houseGraphics.fillStyle(DarkFantasyPalette.oldWood);
    houseGraphics.fillRect(10, 30, 60, 50);
    
    // Door
    houseGraphics.fillStyle(DarkFantasyPalette.darkBark);
    houseGraphics.fillRect(30, 55, 20, 25);
    
    // Dark windows with faint glow
    houseGraphics.fillStyle(DarkFantasyPalette.shadowGreen);
    houseGraphics.fillRect(15, 40, 15, 15);
    houseGraphics.fillRect(50, 40, 15, 15);
    houseGraphics.fillStyle(DarkFantasyPalette.torchGlow, 0.3);
    houseGraphics.fillRect(17, 42, 11, 11);
    
    // Dark roof
    houseGraphics.fillStyle(DarkFantasyPalette.darkStone);
    houseGraphics.beginPath();
    houseGraphics.moveTo(5, 30);
    houseGraphics.lineTo(40, 5);
    houseGraphics.lineTo(75, 30);
    houseGraphics.closePath();
    houseGraphics.fillPath();
    
    houseGraphics.generateTexture('house', 80, 80);
    houseGraphics.destroy();
  }
}
