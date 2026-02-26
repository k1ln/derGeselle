import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';
import { PlayerSprites } from '../sprites/PlayerSprites';
import { TreeSprites } from '../sprites/TreeSprites';
import { RockSprites } from '../sprites/RockSprites';
import { HouseSprites } from '../sprites/HouseSprites';
import { BerryBushSprites } from '../sprites/BerryBushSprites';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private playerSpeed: number = 160;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private berryBushes: Phaser.Physics.Arcade.Sprite[] = [];
  private trees: Phaser.Physics.Arcade.Sprite[] = [];
  private berriesCollected: number = 0;
  private woodCollected: number = 0;
  private resourceText!: Phaser.GameObjects.Text;
  private interactText!: Phaser.GameObjects.Text;
  private harvestProgress: number = 0;
  private harvestDuration: number = 3000; // 3 seconds in milliseconds
  private currentTarget: Phaser.Physics.Arcade.Sprite | null = null;
  private isHarvesting: boolean = false;
  private progressBar!: Phaser.GameObjects.Graphics;
  private progressBarBg!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Load sprites - create them programmatically
    PlayerSprites.create(this);
    TreeSprites.create(this);
    RockSprites.create(this);
    HouseSprites.create(this);
    BerryBushSprites.create(this);
  }

  create(): void {
    // Create grass background
    this.createGrassBackground();

    // Create obstacles (trees, rocks, houses)
    this.obstacles = this.physics.add.staticGroup();
    this.createWorldObjects();

    // Create player
    this.player = this.physics.add.sprite(400, 300, 'player-down-1');
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);

    // Create animations
    PlayerSprites.createAnimations(this);

    // Set up camera
    this.cameras.main.setBounds(0, 0, 1600, 1200);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.physics.world.setBounds(0, 0, 1600, 1200);

    // Add collisions
    this.physics.add.collider(this.player, this.obstacles);

    // Set up keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);

    // Create UI text
    this.resourceText = this.add.text(16, 16, 'Berries: 0  Wood: 0', {
      fontSize: '18px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    });
    this.resourceText.setScrollFactor(0);
    this.resourceText.setDepth(100);

    this.interactText = this.add.text(400, 550, '', {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 8, y: 4 }
    });
    this.interactText.setOrigin(0.5);
    this.interactText.setScrollFactor(0);
    this.interactText.setDepth(100);
    this.interactText.setVisible(false);

    // Create progress bar
    this.progressBarBg = this.add.graphics();
    this.progressBarBg.setScrollFactor(0);
    this.progressBarBg.setDepth(101);
    this.progressBarBg.setVisible(false);

    this.progressBar = this.add.graphics();
    this.progressBar.setScrollFactor(0);
    this.progressBar.setDepth(102);
    this.progressBar.setVisible(false);
  }

  update(): void {
    // Reset velocity
    this.player.setVelocity(0);

    let isMoving = false;

    // Handle movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.anims.play('walk-left', true);
      isMoving = true;
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play('walk-right', true);
      isMoving = true;
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.player.anims.play('walk-up', true);
      }
      isMoving = true;
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
        this.player.anims.play('walk-down', true);
      }
      isMoving = true;
    }

    // Stop animation when not moving
    if (!isMoving) {
      this.player.anims.stop();
    }

    // Normalize diagonal movement
    if (this.player.body) {
      this.player.body.velocity.normalize().scale(this.playerSpeed);
    }

    // Check for nearby resources
    this.checkNearbyResources();
  }

  private checkNearbyResources(): void {
    let nearResource: Phaser.Physics.Arcade.Sprite | null = null;
    let resourceType: string = '';
    const interactDistance = 50;

    // Check berry bushes
    for (const bush of this.berryBushes) {
      if (!bush.active) continue;
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        bush.x, bush.y
      );
      
      if (distance < interactDistance) {
        const state = bush.getData('state') as number;
        if (state > 0) {
          nearResource = bush;
          resourceType = 'berry';
          break;
        }
      }
    }

    // Check trees
    if (!nearResource) {
      for (const tree of this.trees) {
        if (!tree.active) continue;
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          tree.x, tree.y
        );
        
        if (distance < 100) { // Very large distance - player can interact from anywhere near tree
          const state = tree.getData('state') as number;
          if (state > 0) {
            nearResource = tree;
            resourceType = 'tree';
            break;
          }
        }
      }
    }

    // Handle harvesting
    if (nearResource) {
      const isHoldingE = this.interactKey.isDown;

      if (isHoldingE) {
        // Start or continue harvesting
        if (!this.isHarvesting || this.currentTarget !== nearResource) {
          this.isHarvesting = true;
          this.currentTarget = nearResource;
          this.harvestProgress = 0;
        }

        // Update progress
        this.harvestProgress += this.game.loop.delta;
        const progress = Math.min(this.harvestProgress / this.harvestDuration, 1);

        // Update UI
        if (resourceType === 'berry') {
          this.interactText.setText('Hold E to collect berries...');
        } else {
          this.interactText.setText('Hold E to chop wood...');
        }
        this.interactText.setVisible(true);

        this.updateProgressBar(progress);

        // Complete harvest
        if (progress >= 1) {
          if (resourceType === 'berry') {
            this.collectBerries(nearResource);
          } else {
            this.chopTree(nearResource);
          }
          this.resetHarvest();
        }
      } else {
        // Show prompt but not harvesting
        if (resourceType === 'berry') {
          this.interactText.setText('Hold E to collect berries');
        } else {
          this.interactText.setText('Hold E to chop wood');
        }
        this.interactText.setVisible(true);
        this.resetHarvest();
      }
    } else {
      this.interactText.setText('');
      this.interactText.setVisible(false);
      this.resetHarvest();
    }
  }

  private updateProgressBar(progress: number): void {
    const barWidth = 200;
    const barHeight = 20;
    const x = 400 - barWidth / 2;
    const y = 520;

    // Background
    this.progressBarBg.clear();
    this.progressBarBg.fillStyle(0x000000, 0.7);
    this.progressBarBg.fillRect(x - 2, y - 2, barWidth + 4, barHeight + 4);
    this.progressBarBg.setVisible(true);

    // Progress
    this.progressBar.clear();
    this.progressBar.fillStyle(DarkFantasyPalette.mysticTeal);
    this.progressBar.fillRect(x, y, barWidth * progress, barHeight);
    this.progressBar.setVisible(true);
  }

  private resetHarvest(): void {
    this.isHarvesting = false;
    this.currentTarget = null;
    this.harvestProgress = 0;
    this.progressBarBg.setVisible(false);
    this.progressBar.setVisible(false);
  }

  private collectBerries(bush: Phaser.Physics.Arcade.Sprite): void {
    const state = bush.getData('state') as number;
    if (state <= 0) return;

    const newState = state - 1;
    bush.setData('state', newState);
    this.berriesCollected += 3;
    this.updateResourceText();

    // Update bush appearance
    if (newState === 2) {
      bush.setTexture('berry-bush-2');
    } else if (newState === 1) {
      bush.setTexture('berry-bush-1');
    } else {
      bush.setTexture('berry-bush-0');
    }
  }

  private chopTree(tree: Phaser.Physics.Arcade.Sprite): void {
    const state = tree.getData('state') as number;
    if (state <= 0) return;

    const newState = state - 1;
    const variation = tree.getData('variation') as number;
    tree.setData('state', newState);
    this.woodCollected += 5;
    this.updateResourceText();

    // Update tree appearance with variation
    if (newState === 2) {
      tree.setTexture(`tree-2-v${variation}`);
    } else if (newState === 1) {
      tree.setTexture(`tree-1-v${variation}`);
    } else {
      tree.setTexture(`tree-0-v${variation}`);
    }
  }

  private updateResourceText(): void {
    this.resourceText.setText(`Berries: ${this.berriesCollected}  Wood: ${this.woodCollected}`);
  }

  private createGrassBackground(): void {
    const graphics = this.add.graphics();
    // Dark, moody ground
    graphics.fillStyle(DarkFantasyPalette.darkGrass);
    graphics.fillRect(0, 0, 1600, 1200);

    // Add dark forest ground texture with dead grass and shadows
    for (let i = 0; i < 300; i++) {
      const x = Phaser.Math.Between(0, 1600);
      const y = Phaser.Math.Between(0, 1200);
      const colors = [
        DarkFantasyPalette.forestGreen,
        DarkFantasyPalette.deadGrass,
        DarkFantasyPalette.shadowGreen
      ];
      const color = colors[Phaser.Math.Between(0, 2)];
      graphics.fillStyle(color, 0.4);
      graphics.fillCircle(x, y, Phaser.Math.Between(2, 8));
    }
    
    // Add subtle fog patches
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, 1600);
      const y = Phaser.Math.Between(0, 1200);
      graphics.fillStyle(DarkFantasyPalette.moonlight, 0.1);
      graphics.fillCircle(x, y, Phaser.Math.Between(20, 50));
    }
  }

  private createWorldObjects(): void {
    // Create trees
    const treePositions = [
      { x: 200, y: 200 }, { x: 350, y: 180 }, { x: 500, y: 250 },
      { x: 700, y: 300 }, { x: 900, y: 200 }, { x: 1100, y: 350 },
      { x: 250, y: 500 }, { x: 600, y: 600 }, { x: 1000, y: 700 },
      { x: 1300, y: 400 }, { x: 1400, y: 800 }, { x: 400, y: 900 },
      { x: 800, y: 1000 }, { x: 1200, y: 1000 }, { x: 300, y: 1100 }
    ];

    treePositions.forEach(pos => {
      const variation = Phaser.Math.Between(0, 2);
      const tree = this.add.sprite(pos.x, pos.y, `tree-3-v${variation}`);
      tree.setDepth(100); // Render tree in foreground so foliage overlaps player
      tree.setData('state', 3);
      tree.setData('variation', variation);
      this.trees.push(tree as any);
    });

    // Create rocks
    const rockPositions = [
      { x: 450, y: 400 }, { x: 800, y: 450 }, { x: 1100, y: 600 },
      { x: 300, y: 700 }, { x: 950, y: 900 }, { x: 1400, y: 500 },
      { x: 600, y: 200 }, { x: 1300, y: 900 }
    ];

    rockPositions.forEach(pos => {
      const variation = Phaser.Math.Between(0, 2);
      const rock = this.obstacles.create(pos.x, pos.y, `rock-v${variation}`);
      rock.setSize(24, 24);
      rock.setOffset(12, 12);
      rock.refreshBody();
    });

    // Create houses
    const housePositions = [
      { x: 1200, y: 200 }, { x: 200, y: 850 }, { x: 1300, y: 700 }
    ];

    housePositions.forEach(pos => {
      const house = this.obstacles.create(pos.x, pos.y, 'house');
      house.setSize(48, 40);
      house.setOffset(16, 40);
      house.refreshBody();
    });

    // Create berry bushes
    const berryPositions = [
      { x: 280, y: 350 }, { x: 520, y: 480 }, { x: 850, y: 380 },
      { x: 1150, y: 500 }, { x: 380, y: 650 }, { x: 720, y: 750 },
      { x: 1050, y: 850 }, { x: 450, y: 1050 }, { x: 900, y: 550 },
      { x: 1350, y: 550 }, { x: 650, y: 350 }, { x: 1200, y: 650 }
    ];

    berryPositions.forEach(pos => {
      const berry = this.obstacles.create(pos.x, pos.y, 'berry-bush-3') as Phaser.Physics.Arcade.Sprite;
      berry.setSize(24, 24);
      berry.setOffset(8, 8);
      berry.setData('state', 3);
      berry.refreshBody();
      this.berryBushes.push(berry);
    });
  }
}
