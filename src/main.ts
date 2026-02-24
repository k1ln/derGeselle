import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { DarkFantasyPalette } from './colors';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: DarkFantasyPalette.deepNight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false
    }
  },
  scene: [GameScene]
};

new Phaser.Game(config);
