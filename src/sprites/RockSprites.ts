import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class RockSprites {
  static create(scene: Phaser.Scene): void {
    // Create 3 variations of rocks
    for (let variation = 0; variation < 3; variation++) {
      const seed = variation * 1000;
      const rockGraphics = scene.add.graphics({ x: 0, y: 0 });
      
      this.drawDetailedRock(rockGraphics, 24, 24, seed);
      
      rockGraphics.generateTexture(`rock-v${variation}`, 48, 48);
      rockGraphics.destroy();
    }
  }

  private static random(seed: number): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  private static drawDetailedRock(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number, seed: number): void {
    const rockSize = 16 + this.random(seed++) * 6;
    
    // Draw multiple angular rock chunks
    const numChunks = 8 + Math.floor(this.random(seed++) * 6);
    
    for (let i = 0; i < numChunks; i++) {
      const chunkSeed = seed + i * 100;
      const offsetX = (this.random(chunkSeed) - 0.5) * rockSize * 1.5;
      const offsetY = (this.random(chunkSeed + 1) - 0.5) * rockSize * 1.5;
      const chunkSize = 4 + this.random(chunkSeed + 2) * 10;
      
      // Base stone color with variation
      const colorVariation = Math.floor(this.random(chunkSeed + 3) * 3);
      let baseColor: number = DarkFantasyPalette.stoneGray;
      if (colorVariation === 1) baseColor = DarkFantasyPalette.darkStone;
      if (colorVariation === 2) baseColor = DarkFantasyPalette.mossyStone;
      
      graphics.fillStyle(baseColor);
      this.drawAngularShape(graphics, centerX + offsetX, centerY + offsetY, chunkSize, 6 + Math.floor(this.random(chunkSeed + 4) * 3), chunkSeed + 5);
    }
    
    // Add dark cracks and crevices
    const numCracks = 15 + Math.floor(this.random(seed + 500) * 20);
    for (let i = 0; i < numCracks; i++) {
      const crackSeed = seed + 500 + i * 10;
      const offsetX = (this.random(crackSeed) - 0.5) * rockSize * 1.8;
      const offsetY = (this.random(crackSeed + 1) - 0.5) * rockSize * 1.8;
      const crackSize = 1 + this.random(crackSeed + 2) * 4;
      
      graphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.6 + this.random(crackSeed + 3) * 0.4);
      this.drawAngularShape(graphics, centerX + offsetX, centerY + offsetY, crackSize, 5 + Math.floor(this.random(crackSeed + 4) * 3), crackSeed + 5);
    }
    
    // Add moss patches
    const numMoss = 10 + Math.floor(this.random(seed + 1000) * 15);
    for (let i = 0; i < numMoss; i++) {
      const mossSeed = seed + 1000 + i * 10;
      const offsetX = (this.random(mossSeed) - 0.5) * rockSize * 1.5;
      const offsetY = (this.random(mossSeed + 1) - 0.5) * rockSize * 1.5;
      const mossSize = 2 + this.random(mossSeed + 2) * 5;
      
      graphics.fillStyle(DarkFantasyPalette.mossyStone, 0.5 + this.random(mossSeed + 3) * 0.3);
      this.drawAngularShape(graphics, centerX + offsetX, centerY + offsetY, mossSize, 4 + Math.floor(this.random(mossSeed + 4) * 4), mossSeed + 5);
    }
    
    // Add highlights
    const numHighlights = 8 + Math.floor(this.random(seed + 1500) * 12);
    for (let i = 0; i < numHighlights; i++) {
      const highlightSeed = seed + 1500 + i * 10;
      const offsetX = (this.random(highlightSeed) - 0.5) * rockSize * 1.3;
      const offsetY = (this.random(highlightSeed + 1) - 0.5) * rockSize * 1.3;
      const highlightSize = 1 + this.random(highlightSeed + 2) * 3;
      
      graphics.fillStyle(DarkFantasyPalette.moonlight, 0.2 + this.random(highlightSeed + 3) * 0.3);
      this.drawAngularShape(graphics, centerX + offsetX, centerY + offsetY, highlightSize, 4 + Math.floor(this.random(highlightSeed + 4) * 3), highlightSeed + 5);
    }
    
    // Add small stone details and fragments
    const numDetails = 20 + Math.floor(this.random(seed + 2000) * 30);
    for (let i = 0; i < numDetails; i++) {
      const detailSeed = seed + 2000 + i * 10;
      const offsetX = (this.random(detailSeed) - 0.5) * rockSize * 2;
      const offsetY = (this.random(detailSeed + 1) - 0.5) * rockSize * 2;
      const detailSize = 0.5 + this.random(detailSeed + 2) * 2;
      
      const detailType = Math.floor(this.random(detailSeed + 3) * 3);
      let color: number = DarkFantasyPalette.darkStone;
      if (detailType === 1) color = DarkFantasyPalette.stoneGray;
      if (detailType === 2) color = DarkFantasyPalette.shadowGreen;
      
      graphics.fillStyle(color, 0.4 + this.random(detailSeed + 4) * 0.4);
      this.drawAngularShape(graphics, centerX + offsetX, centerY + offsetY, detailSize, 3 + Math.floor(this.random(detailSeed + 5) * 4), detailSeed + 6);
    }
  }

  private static drawAngularShape(
    graphics: Phaser.GameObjects.Graphics, 
    x: number, 
    y: number, 
    size: number, 
    vertices: number, 
    seed: number
  ): void {
    const points: { x: number; y: number }[] = [];
    
    for (let i = 0; i < vertices; i++) {
      const angle = (i / vertices) * Math.PI * 2;
      const randomOffset = 0.7 + this.random(seed + i) * 0.6; // Irregular shape
      const radius = size * randomOffset;
      
      points.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      });
    }
    
    graphics.beginPath();
    graphics.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      graphics.lineTo(points[i].x, points[i].y);
    }
    graphics.closePath();
    graphics.fillPath();
  }
}
