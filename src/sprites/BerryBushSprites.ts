import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

export class BerryBushSprites {
  static create(scene: Phaser.Scene): void {
    const berryGraphics = scene.add.graphics({ x: 0, y: 0 });

    const bushClusters: Array<{ x: number; y: number; size: number }> = [
      { x: 20, y: 22, size: 12 },
      { x: 12, y: 20, size: 9 },
      { x: 29, y: 20, size: 10 },
      { x: 18, y: 13, size: 7 },
      { x: 24, y: 14, size: 7 },
      { x: 15, y: 27, size: 8 },
      { x: 25, y: 28, size: 8 },
      { x: 8, y: 25, size: 6 },
      { x: 33, y: 26, size: 6 },
      { x: 21, y: 30, size: 7 },
    ];

    const berrySpots: Array<{ x: number; y: number; size: number }> = [
      { x: 14, y: 15, size: 2.2 },
      { x: 18, y: 18, size: 2.0 },
      { x: 22, y: 16, size: 2.1 },
      { x: 26, y: 18, size: 1.9 },
      { x: 30, y: 22, size: 2.2 },
      { x: 24, y: 23, size: 2.4 },
      { x: 18, y: 24, size: 2.3 },
      { x: 12, y: 22, size: 2.0 },
      { x: 16, y: 28, size: 2.0 },
      { x: 26, y: 29, size: 2.0 },
      { x: 20, y: 11, size: 1.8 },
      { x: 28, y: 14, size: 1.7 },
    ];

    const drawSquare = (x: number, y: number, size: number): void => {
      const halfSize = size / 2;
      berryGraphics.fillRect(x - halfSize, y - halfSize, size, size);
    };

    const drawDetailedBush = (berriesToDraw: number): void => {
      // Soft silhouette / outline pass to make it pop
      berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.85);
      for (const cluster of bushClusters) {
        drawSquare(cluster.x + 0.5, cluster.y + 0.5, cluster.size * 2 + 2.4);
      }

      // Main foliage
      berryGraphics.fillStyle(DarkFantasyPalette.forestGreen, 1);
      for (const cluster of bushClusters) {
        drawSquare(cluster.x, cluster.y, cluster.size * 2);
      }

      // Deeper interior shadows (bottom-right bias)
      berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.35);
      drawSquare(23, 26, 20);
      drawSquare(14, 25, 14);
      drawSquare(29, 24, 14);
      drawSquare(20, 19, 16);

      // Mid-tone highlight blobs (top-left bias)
      berryGraphics.fillStyle(DarkFantasyPalette.darkGrass, 0.5);
      drawSquare(15, 16, 10);
      drawSquare(24, 15, 10);
      drawSquare(19, 26, 8);
      drawSquare(10, 22, 7);

      // Tiny leaf speckles for texture
      berryGraphics.fillStyle(DarkFantasyPalette.moonlight, 0.18);
      drawSquare(13, 18, 2.4);
      drawSquare(17, 14, 2.0);
      drawSquare(22, 13, 2.2);
      drawSquare(27, 15, 2.0);
      drawSquare(30, 20, 2.2);
      drawSquare(26, 26, 2.4);
      drawSquare(18, 28, 2.2);
      drawSquare(11, 26, 2.0);
      drawSquare(9, 23, 1.8);

      // Branches/twigs peeking through
      berryGraphics.fillStyle(DarkFantasyPalette.darkBark, 1);
      berryGraphics.fillRect(19, 29, 3, 8);
      berryGraphics.fillRect(14, 27, 2, 5);
      berryGraphics.fillRect(24, 27, 2, 5);
      berryGraphics.fillRect(11, 24, 2, 4);
      berryGraphics.fillRect(27, 24, 2, 4);
      berryGraphics.fillStyle(DarkFantasyPalette.oldWood, 0.9);
      berryGraphics.fillRect(20, 31, 1, 6);
      berryGraphics.fillRect(15, 28, 1, 3);
      berryGraphics.fillRect(25, 28, 1, 3);

      // Berries (with shadow + tiny highlight)
      const clamped = Math.max(0, Math.min(berriesToDraw, berrySpots.length));
      for (let i = 0; i < clamped; i++) {
        const b = berrySpots[i];
        berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
        drawSquare(b.x + 0.7, b.y + 0.8, (b.size + 0.2) * 2);

        berryGraphics.fillStyle(DarkFantasyPalette.bloodRed, 1);
        drawSquare(b.x, b.y, b.size * 2);

        berryGraphics.fillStyle(DarkFantasyPalette.moonlight, 0.55);
        drawSquare(b.x - 0.6, b.y - 0.6, Math.max(1.4, b.size * 0.7));

        berryGraphics.fillStyle(DarkFantasyPalette.darkBark, 0.75);
        drawSquare(b.x + 0.2, b.y + 1.2, Math.max(0.8, b.size * 0.4));
      }
    };

    // Generate textures with increasing berry density
    drawDetailedBush(0);
    berryGraphics.generateTexture('berry-bush-0', 40, 40);
    berryGraphics.clear();

    drawDetailedBush(3);
    berryGraphics.generateTexture('berry-bush-1', 40, 40);
    berryGraphics.clear();

    drawDetailedBush(7);
    berryGraphics.generateTexture('berry-bush-2', 40, 40);
    berryGraphics.clear();

    drawDetailedBush(berrySpots.length);
    berryGraphics.generateTexture('berry-bush-3', 40, 40);
    berryGraphics.destroy();
  }
}
