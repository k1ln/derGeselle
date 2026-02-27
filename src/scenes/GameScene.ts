import Phaser from 'phaser';
import { DarkFantasyPalette } from '../colors';
import { PlayerSprites } from '../sprites/PlayerSprites';
import { TreeSprites } from '../sprites/TreeSprites';
import { RockSprites } from '../sprites/RockSprites';
import { HouseSprites } from '../sprites/HouseSprites';
import { BerryBushSprites } from '../sprites/BerryBushSprites';
import { MouseSprites } from '../sprites/MouseSprites';
import { Inventory } from '../inventory/Inventory';
import { InventoryUI } from '../inventory/InventoryUI';
import { ITEM_TYPES } from '../inventory/InventoryItem';

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private playerSpeed: number = 160;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private inventoryKey!: Phaser.Input.Keyboard.Key;
  private berryBushes: Phaser.Physics.Arcade.Sprite[] = [];
  private trees: Phaser.Physics.Arcade.Sprite[] = [];
  private rocks: Phaser.Physics.Arcade.Sprite[] = [];
  private droppedItems: Phaser.Physics.Arcade.Sprite[] = [];
  private sweetMouse: Phaser.Physics.Arcade.Sprite | null = null;
  private inventory!: Inventory;
  private inventoryUI!: InventoryUI;
  private interactText!: Phaser.GameObjects.Text;
  private harvestProgress: number = 0;
  private harvestDuration: number = 3000; // 3 seconds in milliseconds
  private rockHarvestDuration: number = 6000; // 6 seconds for rocks (harder to mine)
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
    MouseSprites.create(this);
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
    // Add collisions for rocks separately since they're farmable now
    this.rocks.forEach(rock => {
      this.physics.add.collider(this.player, rock);
    });

    // Set up keyboard controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.inventoryKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.I);

    // Create inventory system
    this.inventory = new Inventory(false); // Start without bag
    this.inventoryUI = new InventoryUI(this, this.inventory);
    
    // Setup drop item handler
    this.inventoryUI.onDropItem = (itemType: string, amount: number) => {
      console.log('GameScene: onDropItem callback received:', itemType, amount);
      this.spawnDroppedItem(itemType, amount);
    };

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

    // Spawn a sweet little mouse next to the player
    this.spawnSweetMouse();
  }

  update(): void {
    // Handle inventory toggle
    if (Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
      this.inventoryUI.toggle();
    }

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
    
    // Check for nearby dropped items
    this.checkNearbyDroppedItems();
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

    // Check rocks
    if (!nearResource) {
      for (const rock of this.rocks) {
        if (!rock.active) continue;
        const distance = Phaser.Math.Distance.Between(
          this.player.x, this.player.y,
          rock.x, rock.y
        );
        
        if (distance < 60) {
          const state = rock.getData('state') as number;
          if (state > 0) {
            nearResource = rock;
            resourceType = 'rock';
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
        const duration = resourceType === 'rock' ? this.rockHarvestDuration : this.harvestDuration;
        const progress = Math.min(this.harvestProgress / duration, 1);

        // Update UI
        if (resourceType === 'berry') {
          this.interactText.setText('Hold E to collect berries...');
        } else if (resourceType === 'tree') {
          this.interactText.setText('Hold E to chop wood...');
        } else if (resourceType === 'rock') {
          this.interactText.setText('Hold E to mine stone...');
        }
        this.interactText.setVisible(true);

        this.updateProgressBar(progress);

        // Complete harvest
        if (progress >= 1) {
          if (resourceType === 'berry') {
            this.collectBerries(nearResource);
          } else if (resourceType === 'tree') {
            this.chopTree(nearResource);
          } else if (resourceType === 'rock') {
            this.mineRock(nearResource);
          }
          this.resetHarvest();
        }
      } else {
        // Show prompt but not harvesting
        if (resourceType === 'berry') {
          this.interactText.setText('Hold E to collect berries');
        } else if (resourceType === 'tree') {
          this.interactText.setText('Hold E to chop wood');
        } else if (resourceType === 'rock') {
          this.interactText.setText('Hold E to mine stone');
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

    // Try to add berries to inventory
    const amount = 30; // Collect 30 berries (3 units worth, since berries are 0.1 space each)
    if (this.inventory.addItem(ITEM_TYPES.BERRY, amount)) {
      const newState = state - 1;
      bush.setData('state', newState);
      this.inventoryUI.update();

      // Update bush appearance
      if (newState === 2) {
        bush.setTexture('berry-bush-2');
      } else if (newState === 1) {
        bush.setTexture('berry-bush-1');
      } else {
        bush.setTexture('berry-bush-0');
      }
    } else {
      // Inventory full
      this.showInventoryFullMessage();
    }
  }

  private chopTree(tree: Phaser.Physics.Arcade.Sprite): void {
    const state = tree.getData('state') as number;
    if (state <= 0) return;

    // Try to add wood to inventory
    const amount = 5; // Collect 5 wood
    if (this.inventory.addItem(ITEM_TYPES.WOOD, amount)) {
      const newState = state - 1;
      const variation = tree.getData('variation') as number;
      tree.setData('state', newState);
      this.inventoryUI.update();

      // Update tree appearance with variation
      if (newState === 2) {
        tree.setTexture(`tree-2-v${variation}`);
      } else if (newState === 1) {
        tree.setTexture(`tree-1-v${variation}`);
      } else {
        tree.setTexture(`tree-0-v${variation}`);
      }
    } else {
      // Inventory full
      this.showInventoryFullMessage();
    }
  }

  private mineRock(rock: Phaser.Physics.Arcade.Sprite): void {
    const state = rock.getData('state') as number;
    if (state <= 0) return;

    // Try to add stone to inventory
    const amount = 3; // Collect 3 stone (rocks are harder, give less per harvest)
    if (this.inventory.addItem(ITEM_TYPES.STONE, amount)) {
      // Rocks don't diminish as easily - only reduce state every other time
      const mineCount = (rock.getData('mineCount') || 0) + 1;
      rock.setData('mineCount', mineCount);
      
      let newState = state;
      if (mineCount >= 2) { // Only reduce state every 2 mines
        newState = state - 1;
        rock.setData('state', newState);
        rock.setData('mineCount', 0);
      }
      
      const variation = rock.getData('variation') as number;
      this.inventoryUI.update();

      // Update rock appearance with variation
      if (newState === 2) {
        rock.setTexture(`rock-2-v${variation}`);
      } else if (newState === 1) {
        rock.setTexture(`rock-1-v${variation}`);
      } else if (newState === 0) {
        rock.setTexture(`rock-0-v${variation}`);
      }
    } else {
      // Inventory full
      this.showInventoryFullMessage();
    }
  }

  private showInventoryFullMessage(): void {
    // Could add a temporary message here
    console.log('Inventory full!');
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

    // Create rocks (now farmable!)
    const rockPositions = [
      { x: 450, y: 400 }, { x: 800, y: 450 }, { x: 1100, y: 600 },
      { x: 300, y: 700 }, { x: 950, y: 900 }, { x: 1400, y: 500 },
      { x: 600, y: 200 }, { x: 1300, y: 900 }
    ];

    rockPositions.forEach(pos => {
      const variation = Phaser.Math.Between(0, 2);
      const rock = this.add.sprite(pos.x, pos.y, `rock-3-v${variation}`) as Phaser.Physics.Arcade.Sprite;
      this.physics.add.existing(rock, true); // true = static body
      rock.body!.setSize(24, 24);
      (rock.body as Phaser.Physics.Arcade.StaticBody).setOffset(12, 12);
      rock.setData('state', 3);
      rock.setData('variation', variation);
      rock.setData('mineCount', 0);
      this.rocks.push(rock);
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

  private spawnDroppedItem(itemType: string, amount: number): void {
    console.log('spawnDroppedItem called with:', itemType, amount);
    
    // Determine drop direction based on player's velocity (which direction they're facing/moving)
    let dropAngle = Math.PI / 2; // Default to down (90 degrees)
    
    const velocityX = this.player.body?.velocity.x || 0;
    const velocityY = this.player.body?.velocity.y || 0;
    
    if (Math.abs(velocityX) > 5 || Math.abs(velocityY) > 5) {
      // Player is moving, use movement direction
      dropAngle = Math.atan2(velocityY, velocityX);
    } else {
      // Player is stationary, check last animation to determine facing direction
      const currentAnim = this.player.anims.currentAnim?.key || 'walk-down';
      if (currentAnim.includes('up')) dropAngle = -Math.PI / 2; // Up
      else if (currentAnim.includes('down')) dropAngle = Math.PI / 2; // Down
      else if (currentAnim.includes('left')) dropAngle = Math.PI; // Left
      else if (currentAnim.includes('right')) dropAngle = 0; // Right
    }
    
    // Add random variation ±22.5 degrees (total 45-degree arc in front)
    const angleVariation = (Math.random() - 0.5) * (Math.PI / 4); // ±22.5 degrees
    dropAngle += angleVariation;
    
    // Drop item 30-40 pixels in front of player
    const distance = Phaser.Math.Between(30, 40);
    const offsetX = Math.cos(dropAngle) * distance;
    const offsetY = Math.sin(dropAngle) * distance;
    const x = this.player.x + offsetX;
    const y = this.player.y + offsetY;
    
    console.log('Spawning at position:', x, y);

    // Create a visual representation for the dropped item
    const itemSprite = this.physics.add.sprite(x, y, 'player-down-1'); // Temporary sprite
    itemSprite.setScale(0.5);
    itemSprite.setDepth(5);
    
    // Draw item appearance
    const graphics = this.add.graphics();
    graphics.setPosition(x, y);
    graphics.setDepth(5);
    
    if (itemType === 'berry') {
      graphics.fillStyle(DarkFantasyPalette.bloodRed, 1);
      graphics.fillCircle(0, 0, 6);
      graphics.fillStyle(0xff6b6b, 0.6);
      graphics.fillCircle(-2, -2, 3);
    } else if (itemType === 'wood') {
      graphics.fillStyle(DarkFantasyPalette.oldWood, 1);
      graphics.fillRect(-8, -6, 16, 12);
      graphics.fillStyle(DarkFantasyPalette.darkBark, 0.4);
      graphics.fillRect(-6, -6, 2, 12);
    } else if (itemType === 'stone') {
      graphics.fillStyle(DarkFantasyPalette.stoneGray, 1);
      graphics.beginPath();
      graphics.moveTo(-7, 0);
      graphics.lineTo(-3, -7);
      graphics.lineTo(5, -5);
      graphics.lineTo(7, 3);
      graphics.lineTo(0, 7);
      graphics.closePath();
      graphics.fillPath();
    }
    
    // Store item data
    itemSprite.setData('itemType', itemType);
    itemSprite.setData('amount', amount);
    itemSprite.setData('graphics', graphics);
    itemSprite.setData('dropTime', this.time.now); // Track when item was dropped
    
    // Make it static so it doesn't fall through world
    (itemSprite.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    (itemSprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    
    this.droppedItems.push(itemSprite);
    itemSprite.setAlpha(0); // Hide the default sprite, show only graphics
  }

  private checkNearbyDroppedItems(): void {
    const collectDistance = 10;
    const pickupCooldown = 500; // 500ms cooldown before item can be picked up
    
    for (let i = this.droppedItems.length - 1; i >= 0; i--) {
      const item = this.droppedItems[i];
      if (!item.active) continue;
      
      // Check if item is still in cooldown period
      const dropTime = item.getData('dropTime') as number || 0;
      const timeSinceDrop = this.time.now - dropTime;
      if (timeSinceDrop < pickupCooldown) {
        continue; // Skip this item, still in cooldown
      }
      
      const distance = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        item.x, item.y
      );
      
      if (distance < collectDistance) {
        const itemType = item.getData('itemType') as string;
        const amount = item.getData('amount') as number;
        
        // Try to add to inventory
        let itemTypeObj;
        if (itemType === 'berry') itemTypeObj = ITEM_TYPES.BERRY;
        else if (itemType === 'wood') itemTypeObj = ITEM_TYPES.WOOD;
        else if (itemType === 'stone') itemTypeObj = ITEM_TYPES.STONE;
        
        if (itemTypeObj && this.inventory.addItem(itemTypeObj, amount)) {
          // Successfully picked up
          this.inventoryUI.update();
          
          // Destroy the dropped item
          const graphics = item.getData('graphics') as Phaser.GameObjects.Graphics;
          if (graphics) graphics.destroy();
          item.destroy();
          this.droppedItems.splice(i, 1);
        }
      }
    }
  }

  private spawnSweetMouse(): void {
    console.log('Spawning realistic mouse...');
    console.log('Player position:', this.player.x, this.player.y);
    
    // Spawn a small realistic mouse next to the player
    const offsetDistance = 30; // Close to player
    const angle = Math.PI / 4; // Bottom-right position
    const mouseX = this.player.x + Math.cos(angle) * offsetDistance;
    const mouseY = this.player.y + Math.sin(angle) * offsetDistance;

    console.log('Mouse spawn position:', mouseX, mouseY);

    // Create the mouse sprite - small and realistic
    this.sweetMouse = this.physics.add.sprite(mouseX, mouseY, 'mouse');
    this.sweetMouse.setScale(1); // Small, realistic size compared to player
    this.sweetMouse.setDepth(8);
    
    console.log('Mouse created:', this.sweetMouse);
    console.log('Mouse texture:', this.sweetMouse.texture.key);
    
    // Show idle frame (no animation since no motivation to move)
    this.sweetMouse.setFrame(0);

    // Set mouse attributes - low motivation
    this.sweetMouse.setData('health', 100);
    this.sweetMouse.setData('hunger', 50);
    this.sweetMouse.setData('social', 20); // Low social need
    this.sweetMouse.setData('sleep', 70);
    this.sweetMouse.setData('temperature', 75);

    // Mouse doesn't move - no motivation
    this.sweetMouse.setVelocity(0, 0);
    
    console.log('Mouse spawned - stationary');
  }
}
