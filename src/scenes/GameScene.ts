import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';

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

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Load sprites - we'll create them programmatically
    this.createSprites();
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
    this.createAnimations();

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
    let nearResource = false;
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
          nearResource = true;
          this.interactText.setText('Press E to collect berries');
          
          if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
            this.collectBerries(bush);
          }
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
        
        if (distance < interactDistance) {
          const state = tree.getData('state') as number;
          if (state > 0) {
            nearResource = true;
            this.interactText.setText('Press E to chop wood');
            
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
              this.chopTree(tree);
            }
            break;
          }
        }
      }
    }

    if (!nearResource) {
      this.interactText.setText('');
    }
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
    tree.setData('state', newState);
    this.woodCollected += 5;
    this.updateResourceText();

    // Update tree appearance
    if (newState === 2) {
      tree.setTexture('tree-2');
    } else if (newState === 1) {
      tree.setTexture('tree-1');
    } else {
      tree.setTexture('tree-0');
      tree.setSize(30, 30);
    }
  }

  private updateResourceText(): void {
    this.resourceText.setText(`Berries: ${this.berriesCollected}  Wood: ${this.woodCollected}`);
  }

  private createSprites(): void {
    // Create player walking animation frames
    this.createPlayerSprites();

    // Create tree sprite - dark dead tree (full state)
    const treeGraphics = this.add.graphics({ x: 0, y: 0 });
    treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
    treeGraphics.fillRect(22, 40, 12, 20);
    treeGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    treeGraphics.fillCircle(28, 30, 20);
    treeGraphics.fillCircle(18, 25, 18);
    treeGraphics.fillCircle(38, 25, 18);
    treeGraphics.fillCircle(28, 18, 16);
    // Add some shadow
    treeGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    treeGraphics.fillCircle(30, 32, 15);
    treeGraphics.generateTexture('tree-3', 64, 64);
    treeGraphics.clear();

    // Tree state 2 - less foliage
    treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
    treeGraphics.fillRect(22, 40, 12, 20);
    treeGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    treeGraphics.fillCircle(28, 28, 16);
    treeGraphics.fillCircle(20, 24, 14);
    treeGraphics.fillCircle(36, 24, 14);
    treeGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    treeGraphics.fillCircle(30, 30, 12);
    treeGraphics.generateTexture('tree-2', 64, 64);
    treeGraphics.clear();

    // Tree state 1 - sparse foliage
    treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
    treeGraphics.fillRect(22, 40, 12, 20);
    treeGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    treeGraphics.fillCircle(28, 26, 12);
    treeGraphics.fillCircle(22, 22, 10);
    treeGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.4);
    treeGraphics.fillCircle(28, 28, 8);
    treeGraphics.generateTexture('tree-1', 64, 64);
    treeGraphics.clear();

    // Tree state 0 - just stump
    treeGraphics.fillStyle(DarkFantasyPalette.darkBark);
    treeGraphics.fillRect(22, 40, 12, 20);
    treeGraphics.fillStyle(DarkFantasyPalette.earthBrown);
    treeGraphics.fillRect(24, 58, 8, 2);
    treeGraphics.generateTexture('tree-0', 64, 64);
    treeGraphics.destroy();

    // Create rock sprite - ancient mossy stone
    const rockGraphics = this.add.graphics({ x: 0, y: 0 });
    rockGraphics.fillStyle(DarkFantasyPalette.stoneGray);
    rockGraphics.fillCircle(24, 24, 18);
    rockGraphics.fillStyle(DarkFantasyPalette.darkStone);
    rockGraphics.fillCircle(20, 20, 12);
    rockGraphics.fillStyle(DarkFantasyPalette.mossyStone);
    rockGraphics.fillCircle(28, 22, 8);
    rockGraphics.fillCircle(22, 26, 6);
    rockGraphics.generateTexture('rock', 48, 48);
    rockGraphics.destroy();

    // Create house sprite - abandoned cottage
    const houseGraphics = this.add.graphics({ x: 0, y: 0 });
    houseGraphics.fillStyle(DarkFantasyPalette.oldWood);
    houseGraphics.fillRect(10, 30, 60, 50);
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

    // Create berry bush sprites - different states
    const berryGraphics = this.add.graphics({ x: 0, y: 0 });
    
    // State 3 - full berries
    berryGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    berryGraphics.fillCircle(20, 20, 12);
    berryGraphics.fillCircle(14, 18, 10);
    berryGraphics.fillCircle(26, 18, 10);
    berryGraphics.fillCircle(20, 14, 8);
    berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    berryGraphics.fillCircle(22, 22, 8);
    berryGraphics.fillStyle(DarkFantasyPalette.bloodRed);
    berryGraphics.fillCircle(16, 16, 2);
    berryGraphics.fillCircle(22, 18, 2);
    berryGraphics.fillCircle(18, 22, 2);
    berryGraphics.fillCircle(24, 14, 2);
    berryGraphics.fillCircle(14, 20, 2);
    berryGraphics.fillCircle(26, 22, 2);
    berryGraphics.generateTexture('berry-bush-3', 40, 40);
    berryGraphics.clear();

    // State 2 - some berries
    berryGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    berryGraphics.fillCircle(20, 20, 12);
    berryGraphics.fillCircle(14, 18, 10);
    berryGraphics.fillCircle(26, 18, 10);
    berryGraphics.fillCircle(20, 14, 8);
    berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    berryGraphics.fillCircle(22, 22, 8);
    berryGraphics.fillStyle(DarkFantasyPalette.bloodRed);
    berryGraphics.fillCircle(16, 16, 2);
    berryGraphics.fillCircle(22, 18, 2);
    berryGraphics.fillCircle(24, 14, 2);
    berryGraphics.generateTexture('berry-bush-2', 40, 40);
    berryGraphics.clear();

    // State 1 - few berries
    berryGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    berryGraphics.fillCircle(20, 20, 12);
    berryGraphics.fillCircle(14, 18, 10);
    berryGraphics.fillCircle(26, 18, 10);
    berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    berryGraphics.fillCircle(22, 22, 8);
    berryGraphics.fillStyle(DarkFantasyPalette.bloodRed);
    berryGraphics.fillCircle(18, 22, 2);
    berryGraphics.generateTexture('berry-bush-1', 40, 40);
    berryGraphics.clear();

    // State 0 - no berries
    berryGraphics.fillStyle(DarkFantasyPalette.forestGreen);
    berryGraphics.fillCircle(20, 20, 12);
    berryGraphics.fillCircle(14, 18, 10);
    berryGraphics.fillCircle(26, 18, 10);
    berryGraphics.fillStyle(DarkFantasyPalette.shadowGreen, 0.5);
    berryGraphics.fillCircle(22, 22, 8);
    berryGraphics.generateTexture('berry-bush-0', 40, 40);
    berryGraphics.destroy();
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
      const tree = this.obstacles.create(pos.x, pos.y, 'tree-3') as Phaser.Physics.Arcade.Sprite;
      tree.setSize(40, 40);
      tree.setOffset(12, 24);
      tree.setData('state', 3);
      tree.refreshBody();
      this.trees.push(tree);
    });

    // Create rocks
    const rockPositions = [
      { x: 450, y: 400 }, { x: 800, y: 450 }, { x: 1100, y: 600 },
      { x: 300, y: 700 }, { x: 950, y: 900 }, { x: 1400, y: 500 },
      { x: 600, y: 200 }, { x: 1300, y: 900 }
    ];

    rockPositions.forEach(pos => {
      const rock = this.obstacles.create(pos.x, pos.y, 'rock');
      rock.setSize(36, 36);
      rock.setOffset(6, 6);
      rock.refreshBody();
    });

    // Create houses
    const housePositions = [
      { x: 1200, y: 200 }, { x: 200, y: 850 }, { x: 1300, y: 700 }
    ];

    housePositions.forEach(pos => {
      const house = this.obstacles.create(pos.x, pos.y, 'house');
      house.setSize(60, 50);
      house.setOffset(10, 30);
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

  private createPlayerSprites(): void {
    const frameWidth = 32;
    const frameHeight = 32;

    // Helper function to draw a human character
    const drawPlayer = (graphics: Phaser.GameObjects.Graphics, frame: number, direction: string, offsetX: number = 0) => {
      // Dark fantasy character colors
      const skinColor = DarkFantasyPalette.paleFlesh;
      const cloakColor = DarkFantasyPalette.cloakGray;
      const armorColor = DarkFantasyPalette.leatherBrown;
      const bootColor = DarkFantasyPalette.darkStone;
      const hairColor = DarkFantasyPalette.oldWood;

      let legOffset = 0;

      // Leg animation: alternating legs
      if (frame === 1) legOffset = 2;
      if (frame === 2) legOffset = -2;

      if (direction === 'down') {
        // Cloak (back)
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 9, 15, 14, 14);
        
        // Legs - add walking animation
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 10, 20 + legOffset, 4, 8);
        graphics.fillRect(offsetX + 18, 20 - legOffset, 4, 8);
        
        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 10, 27 + legOffset, 4, 3);
        graphics.fillRect(offsetX + 18, 27 - legOffset, 4, 3);

        // Body (armor)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 14, 10, 8);

        // Arms
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 8, 15, 3, 7);
        graphics.fillRect(offsetX + 21, 15, 3, 7);

        // Head
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 16, 10, 5);
        
        // Eyes (glowing)
        graphics.fillStyle(DarkFantasyPalette.mysticTeal);
        graphics.fillRect(offsetX + 13, 10, 2, 1);
        graphics.fillRect(offsetX + 17, 10, 2, 1);

      } else if (direction === 'up') {
        // Cloak (front flowing)
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 9, 15, 14, 14);
        
        // Legs (back view)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 10, 20 + legOffset, 4, 8);
        graphics.fillRect(offsetX + 18, 20 - legOffset, 4, 8);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 10, 27 + legOffset, 4, 3);
        graphics.fillRect(offsetX + 18, 27 - legOffset, 4, 3);

        // Body
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 14, 10, 8);

        // Arms
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 8, 15, 3, 7);
        graphics.fillRect(offsetX + 21, 15, 3, 7);

        // Head
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 16, 10, 5);
        
        // Hood shadow
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 11, 5, 10, 3);

      } else if (direction === 'left') {
        // Cloak (side)
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 11, 15, 10, 13);
        
        // Legs (side view with walk animation)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 13, 20 + legOffset, 5, 8);
        graphics.fillRect(offsetX + 15, 20 - legOffset, 5, 8);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 13, 27 + legOffset, 5, 3);
        graphics.fillRect(offsetX + 15, 27 - legOffset, 5, 3);

        // Body (armor)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 12, 14, 9, 8);

        // Arm (front)
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 12, 16, 3, 6);

        // Head
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 16, 10, 5);

        // Eye (glowing)
        graphics.fillStyle(DarkFantasyPalette.mysticTeal);
        graphics.fillRect(offsetX + 14, 10, 2, 1);

      } else if (direction === 'right') {
        // Cloak (side)
        graphics.fillStyle(cloakColor);
        graphics.fillRect(offsetX + 11, 15, 10, 13);
        
        // Legs (side view with walk animation)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 14, 20 + legOffset, 5, 8);
        graphics.fillRect(offsetX + 12, 20 - legOffset, 5, 8);

        // Boots
        graphics.fillStyle(bootColor);
        graphics.fillRect(offsetX + 14, 27 + legOffset, 5, 3);
        graphics.fillRect(offsetX + 12, 27 - legOffset, 5, 3);

        // Body (armor)
        graphics.fillStyle(armorColor);
        graphics.fillRect(offsetX + 11, 14, 9, 8);

        // Arm (front)
        graphics.fillStyle(skinColor);
        graphics.fillRect(offsetX + 17, 16, 3, 6);

        // Head
        graphics.fillStyle(skinColor);
        graphics.fillCircle(offsetX + 16, 10, 5);

        // Eye (glowing)
        graphics.fillStyle(DarkFantasyPalette.mysticTeal);
        graphics.fillRect(offsetX + 16, 10, 2, 1);
      }
    };

    // Create sprite sheets for each direction
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach(direction => {
      // Create individual frame textures
      for (let i = 0; i < 3; i++) {
        const frameGraphics = this.add.graphics({ x: 0, y: 0 });
        drawPlayer(frameGraphics, i, direction, 0);
        frameGraphics.generateTexture(`player-${direction}-${i + 1}`, frameWidth, frameHeight);
        frameGraphics.destroy();
      }
    });
  }

  private createAnimations(): void {
    // Walk down animation
    this.anims.create({
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
    this.anims.create({
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
    this.anims.create({
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
    this.anims.create({
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
