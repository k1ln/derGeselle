import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class TreeSprites {
  static create(scene: Phaser.Scene): void {
    const treeGraphics = scene.add.graphics({ x: 0, y: 0 });
    const treeWidth = 128;
    const treeHeight = 160;

    // Helper to draw a branch recursively
    const drawBranch = (
      graphics: Phaser.GameObjects.Graphics,
      startX: number,
      startY: number,
      angle: number,
      length: number,
      thickness: number,
      depth: number,
      seed: number
    ) => {
      if (depth === 0 || length < 3) return;

      const random = (min: number, max: number, index: number) => {
        const val = Math.sin(seed * 12.9898 + index * 78.233 + depth * 45.123) * 43758.5453;
        return min + (val - Math.floor(val)) * (max - min);
      };

      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      // Draw branch segment with taper
      graphics.lineStyle(thickness, DarkFantasyPalette.darkBark);
      graphics.beginPath();
      graphics.moveTo(startX, startY);
      graphics.lineTo(endX, endY);
      graphics.strokePath();

      // Add bark texture on thicker branches
      if (thickness > 3 && random(0, 1, depth * 77) > 0.3) {
        graphics.fillStyle(DarkFantasyPalette.oldWood);
        const bx = startX + (endX - startX) * random(0.2, 0.8, depth * 88);
        const by = startY + (endY - startY) * random(0.2, 0.8, depth * 99);
        graphics.fillRect(bx - 1, by - 1, random(1, 3, depth * 111), random(2, 4, depth * 122));
      }

      // Recursively draw sub-branches with variation
      const numBranches = depth > 5 ? Math.floor(random(2, 4, depth * 10)) : 
                         depth > 3 ? Math.floor(random(2, 3, depth * 10)) : 
                         Math.floor(random(1, 3, depth * 10));
      
      for (let i = 0; i < numBranches; i++) {
        const branchAngle = angle + random(-0.7, 0.7, i + depth * 50);
        const branchLength = length * random(0.55, 0.8, i + depth * 60);
        const branchThickness = Math.max(1, thickness * random(0.5, 0.7, i + depth * 70));
        const branchStart = random(0.5, 0.9, i + depth * 80);
        
        const branchX = startX + (endX - startX) * branchStart;
        const branchY = startY + (endY - startY) * branchStart;
        
        drawBranch(graphics, branchX, branchY, branchAngle, branchLength, branchThickness, depth - 1, seed + i * 37);
      }
    };

    // Helper to draw leaves on branches
    const drawLeaves = (
      graphics: Phaser.GameObjects.Graphics,
      startX: number,
      startY: number,
      angle: number,
      length: number,
      depth: number,
      density: number,
      seed: number
    ) => {
      if (depth === 0 || length < 3) return;

      const random = (min: number, max: number, index: number) => {
        const val = Math.sin(seed * 12.9898 + index * 78.233 + depth * 45.123) * 43758.5453;
        return min + (val - Math.floor(val)) * (max - min);
      };

      const endX = startX + Math.cos(angle) * length;
      const endY = startY + Math.sin(angle) * length;

      // Draw leaves along the branch
      const leafCount = Math.floor((length / 2.5) * density);
      for (let i = 0; i < leafCount; i++) {
        const t = random(0.3, 1, i + depth * 200);
        const lx = startX + (endX - startX) * t;
        const ly = startY + (endY - startY) * t;
        const leafAngle = random(0, Math.PI * 2, i + depth * 300);
        
        // Draw individual leaves as small shapes
        const leafSize = random(2, 5, i + depth * 400) * density;
        
        // Randomly choose leaf color for variation
        const colorChoice = random(0, 1, i + depth * 500);
        if (colorChoice < 0.65) {
          graphics.fillStyle(DarkFantasyPalette.forestGreen);
        } else if (colorChoice < 0.9) {
          graphics.fillStyle(DarkFantasyPalette.darkGrass);
        } else {
          graphics.fillStyle(DarkFantasyPalette.shadowGreen);
        }
        
        // Draw leaf shape (small oval/ellipse)
        graphics.beginPath();
        graphics.arc(lx, ly, leafSize, leafAngle, leafAngle + Math.PI);
        graphics.fillPath();
        
        // Add smaller highlight to some leaves
        if (random(0, 1, i + depth * 600) > 0.8) {
          graphics.fillStyle(DarkFantasyPalette.darkGrass, 0.6);
          graphics.fillEllipse(lx, ly, leafSize * 0.5, leafSize * 0.3);
        }
      }

      // Recursively draw leaves on sub-branches
      const numBranches = depth > 5 ? Math.floor(random(2, 4, depth * 10)) : 
                         depth > 3 ? Math.floor(random(2, 3, depth * 10)) : 
                         Math.floor(random(1, 3, depth * 10));
      
      for (let i = 0; i < numBranches; i++) {
        const branchAngle = angle + random(-0.7, 0.7, i + depth * 50);
        const branchLength = length * random(0.55, 0.8, i + depth * 60);
        const branchStart = random(0.5, 0.9, i + depth * 80);
        
        const branchX = startX + (endX - startX) * branchStart;
        const branchY = startY + (endY - startY) * branchStart;
        
        drawLeaves(graphics, branchX, branchY, branchAngle, branchLength, depth - 1, density, seed + i * 37);
      }
    };

    // Generate tree variations
    for (let variation = 0; variation < 3; variation++) {
      const seed = variation * 123.456 + 789;
      const sizeVariation = 0.85 + variation * 0.1;
      
      const random = (min: number, max: number, index: number) => {
        const val = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
        return min + (val - Math.floor(val)) * (max - min);
      };

      // State 3 - Full tree with lots of leaves
      treeGraphics.clear();
      
      // Draw main trunk as branches (not a rectangle)
      const trunkX = treeWidth / 2;
      const trunkBaseY = treeHeight - 10;
      const trunkHeight = treeHeight * 0.65;
      
      // Main trunk drawn as thick branch going upward
      drawBranch(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 10 * sizeVariation, 7, seed);
      
      // Add 2-3 more thick base branches for more structure
      const baseBranches = 2 + Math.floor(random(0, 2, 11));
      for (let i = 0; i < baseBranches; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseThickness = random(8, 11, i + 40) * sizeVariation;
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawBranch(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, baseThickness, 7, seed + i * 100);
      }
      
      // Add many medium branches spreading from mid-trunk area
      const midBranchCount = 6 + Math.floor(random(0, 4, 61));
      for (let i = 0; i < midBranchCount; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        const branchThickness = random(5, 8, i + 110);
        
        drawBranch(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, branchThickness, 6, seed + i * 150);
      }
      
      // Draw leaves with full density
      drawLeaves(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 7, 1.0, seed);
      
      for (let i = 0; i < baseBranches; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawLeaves(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, 7, 1.0, seed + i * 100);
      }
      
      for (let i = 0; i < midBranchCount; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        
        drawLeaves(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, 6, 1.0, seed + i * 150);
      }
      
      treeGraphics.generateTexture(`tree-3-v${variation}`, treeWidth, treeHeight);

      // State 2 - Medium leaves
      treeGraphics.clear();
      
      // Main trunk as branches
      drawBranch(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 10 * sizeVariation, 7, seed);
      
      const baseBranches2 = 2 + Math.floor(random(0, 2, 11));
      for (let i = 0; i < baseBranches2; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseThickness = random(8, 11, i + 40) * sizeVariation;
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawBranch(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, baseThickness, 7, seed + i * 100);
      }
      
      const midBranchCount2 = 6 + Math.floor(random(0, 4, 61));
      for (let i = 0; i < midBranchCount2; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        const branchThickness = random(5, 8, i + 110);
        
        drawBranch(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, branchThickness, 6, seed + i * 150);
      }
      
      // Medium leaf density
      drawLeaves(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 7, 0.5, seed);
      
      for (let i = 0; i < baseBranches2; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawLeaves(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, 7, 0.5, seed + i * 100);
      }
      
      for (let i = 0; i < midBranchCount2; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        
        drawLeaves(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, 6, 0.5, seed + i * 150);
      }
      
      treeGraphics.generateTexture(`tree-2-v${variation}`, treeWidth, treeHeight);

      // State 1 - Sparse leaves
      treeGraphics.clear();
      
      // Main trunk as branches
      drawBranch(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 10 * sizeVariation, 7, seed);
      
      const baseBranches1 = 2 + Math.floor(random(0, 2, 11));
      for (let i = 0; i < baseBranches1; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseThickness = random(8, 11, i + 40) * sizeVariation;
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawBranch(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, baseThickness, 7, seed + i * 100);
      }
      
      const midBranchCount1 = 6 + Math.floor(random(0, 4, 61));
      for (let i = 0; i < midBranchCount1; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        const branchThickness = random(5, 8, i + 110);
        
        drawBranch(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, branchThickness, 6, seed + i * 150);
      }
      
      // Sparse leaf density
      drawLeaves(treeGraphics, trunkX, trunkBaseY, -Math.PI / 2, trunkHeight * 0.4, 7, 0.25, seed);
      
      for (let i = 0; i < baseBranches1; i++) {
        const baseAngle = -Math.PI / 2 + random(-0.4, 0.4, i + 20);
        const baseLength = trunkHeight * random(0.35, 0.45, i + 30);
        const baseStartY = trunkBaseY - random(5, 15, i + 50);
        
        drawLeaves(treeGraphics, trunkX, baseStartY, baseAngle, baseLength, 7, 0.25, seed + i * 100);
      }
      
      for (let i = 0; i < midBranchCount1; i++) {
        const branchY = trunkBaseY - trunkHeight * random(0.2, 0.7, i + 70);
        const branchAngle = (random(0, 1, i + 80) < 0.5 ? -1 : 1) * random(0.4, 1.3, i + 90) - Math.PI / 2;
        const branchLength = random(20, 40, i + 100) * sizeVariation;
        
        drawLeaves(treeGraphics, trunkX + random(-6, 6, i + 120), branchY, branchAngle, branchLength, 6, 0.25, seed + i * 150);
      }
      
      treeGraphics.generateTexture(`tree-1-v${variation}`, treeWidth, treeHeight);

      // State 0 - Stump
      treeGraphics.clear();
      const stumpWidth = 24 * sizeVariation;
      const stumpHeight = 30;
      const stumpX = treeWidth / 2;
      const stumpY = treeHeight - 40;
      
      treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
      treeGraphics.fillRect(stumpX - stumpWidth / 2, stumpY, stumpWidth, stumpHeight);
      
      // Tree rings on top
      treeGraphics.fillStyle(DarkFantasyPalette.earthBrown);
      treeGraphics.fillCircle(stumpX, stumpY, stumpWidth / 2);
      treeGraphics.fillStyle(DarkFantasyPalette.oldWood);
      treeGraphics.fillCircle(stumpX, stumpY, stumpWidth / 2.5);
      treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
      treeGraphics.fillCircle(stumpX, stumpY, stumpWidth / 3.5);
      treeGraphics.fillCircle(stumpX, stumpY, stumpWidth / 6);
      
      treeGraphics.generateTexture(`tree-0-v${variation}`, treeWidth, treeHeight);
    }

    // Create default tree textures (use variation 0)
    const directions = ['0', '1', '2', '3'];
    directions.forEach(state => {
      const sourceTexture = scene.textures.get(`tree-${state}-v0`);
      if (sourceTexture) {
        const source = sourceTexture.getSourceImage();
        scene.textures.addImage(`tree-${state}`, source as HTMLImageElement);
      }
    });

    treeGraphics.destroy();
  }

  // Helper to get a random tree variation texture name
  static getRandomVariation(state: number): string {
    const variation = Phaser.Math.Between(0, 2);
    return `tree-${state}-v${variation}`;
  }
}
