import Phaser from 'phaser';
import { Inventory } from './Inventory';
import { DarkFantasyPalette } from '../colors';

export class InventoryUI {
  private scene: Phaser.Scene;
  private inventory: Inventory;
  private container!: Phaser.GameObjects.Container;
  private slotGraphics: Phaser.GameObjects.Graphics[];
  private slotTexts: Phaser.GameObjects.Text[];
  private itemSprites: Phaser.GameObjects.Graphics[];
  private slotHitAreas: Phaser.GameObjects.Rectangle[];
  private isVisible: boolean;
  private toggleButton!: Phaser.GameObjects.Graphics;
  private toggleButtonText!: Phaser.GameObjects.Text;
  public onDropItem?: (itemType: string, amount: number) => void;

  constructor(scene: Phaser.Scene, inventory: Inventory) {
    this.scene = scene;
    this.inventory = inventory;
    this.slotGraphics = [];
    this.slotTexts = [];
    this.slotHitAreas = [];
    this.itemSprites = [];
    this.isVisible = true; // Start visible

    this.createUI();
    this.createToggleButton();
  }

  private createUI(): void {
    this.container = this.scene.add.container(16, 16);
    this.container.setScrollFactor(0); // Fix to camera - won't move with world
    this.container.setVisible(this.isVisible);
    this.container.setDepth(1000); // High depth to appear above everything

    const slotSize = 48;
    const slotSpacing = 8;

    // Create 4 inventory slots
    for (let i = 0; i < 4; i++) {
      const x = i * (slotSize + slotSpacing);
      
      // Dark stone background for slot
      const slotBg = this.scene.add.graphics();
      slotBg.fillStyle(DarkFantasyPalette.darkStone, 1);
      slotBg.fillRect(x, 0, slotSize, slotSize);
      slotBg.lineStyle(2, DarkFantasyPalette.stoneGray, 1);
      slotBg.strokeRect(x, 0, slotSize, slotSize);
      this.container.add(slotBg);
      this.slotGraphics.push(slotBg);

      // Item sprite placeholder
      const itemSprite = this.scene.add.graphics();
      itemSprite.setPosition(x, 0);
      this.container.add(itemSprite);
      this.itemSprites.push(itemSprite);

      // Quantity text
      const quantityText = this.scene.add.text(x + slotSize - 4, slotSize - 4, '', {
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold',
      });
      quantityText.setOrigin(1, 1);
      this.container.add(quantityText);
      this.slotTexts.push(quantityText);

      // Make slot clickable for dropping items
      const slotIndex = i;
      const hitArea = this.scene.add.rectangle(16 + x + slotSize / 2, 16 + slotSize / 2, slotSize, slotSize);
      hitArea.setScrollFactor(0);
      hitArea.setDepth(1001);
      hitArea.setInteractive();
      hitArea.setAlpha(0.01); // Nearly invisible but interactive
      hitArea.setVisible(this.isVisible); // Match inventory visibility
      this.slotHitAreas.push(hitArea);
      
      hitArea.on('pointerdown', () => {
        console.log('Slot clicked:', slotIndex);
        this.dropItem(slotIndex);
      });

      // Hover effect for slots
      hitArea.on('pointerover', () => {
        slotBg.clear();
        slotBg.fillStyle(DarkFantasyPalette.darkStone, 1);
        slotBg.fillRect(x, 0, slotSize, slotSize);
        slotBg.lineStyle(2, DarkFantasyPalette.mysticTeal, 1);
        slotBg.strokeRect(x, 0, slotSize, slotSize);
      });

      hitArea.on('pointerout', () => {
        slotBg.clear();
        slotBg.fillStyle(DarkFantasyPalette.darkStone, 1);
        slotBg.fillRect(x, 0, slotSize, slotSize);
        slotBg.lineStyle(2, DarkFantasyPalette.stoneGray, 1);
        slotBg.strokeRect(x, 0, slotSize, slotSize);
      });
    }
  }

  private createToggleButton(): void {
    const x = 680;
    const y = 16;
    const width = 80;
    const height = 30;

    // Create button background
    this.toggleButton = this.scene.add.graphics();
    this.toggleButton.setScrollFactor(0); // Fix to camera
    this.toggleButton.setDepth(1000); // High depth to appear above everything
    this.toggleButton.setInteractive(
      new Phaser.Geom.Rectangle(x, y, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    // Draw button
    this.toggleButton.fillStyle(DarkFantasyPalette.darkStone, 1);
    this.toggleButton.fillRect(x, y, width, height);
    this.toggleButton.lineStyle(2, DarkFantasyPalette.stoneGray, 1);
    this.toggleButton.strokeRect(x, y, width, height);

    // Create button text
    this.toggleButtonText = this.scene.add.text(x + width / 2, y + height / 2, 'Inv [I]', {
      fontSize: '14px',
      color: '#ffffff',
      fontStyle: 'bold',
    });
    this.toggleButtonText.setOrigin(0.5, 0.5);
    this.toggleButtonText.setScrollFactor(0); // Fix to camera
    this.toggleButtonText.setDepth(1001); // Above button

    // Click handler
    this.toggleButton.on('pointerdown', () => {
      this.toggle();
    });

    // Hover effects
    this.toggleButton.on('pointerover', () => {
      this.toggleButton.clear();
      this.toggleButton.fillStyle(DarkFantasyPalette.stoneGray, 1);
      this.toggleButton.fillRect(x, y, width, height);
      this.toggleButton.lineStyle(2, DarkFantasyPalette.mysticTeal, 1);
      this.toggleButton.strokeRect(x, y, width, height);
    });

    this.toggleButton.on('pointerout', () => {
      this.toggleButton.clear();
      this.toggleButton.fillStyle(DarkFantasyPalette.darkStone, 1);
      this.toggleButton.fillRect(x, y, width, height);
      this.toggleButton.lineStyle(2, DarkFantasyPalette.stoneGray, 1);
      this.toggleButton.strokeRect(x, y, width, height);
    });
  }

  public toggle(): void {
    this.isVisible = !this.isVisible;
    this.container.setVisible(this.isVisible);
    // Toggle hit areas visibility
    this.slotHitAreas.forEach(hitArea => hitArea.setVisible(this.isVisible));
  }

  public show(): void {
    this.isVisible = true;
    this.container.setVisible(true);
    this.slotHitAreas.forEach(hitArea => hitArea.setVisible(true));
  }

  public hide(): void {
    this.isVisible = false;
    this.container.setVisible(false);
    this.slotHitAreas.forEach(hitArea => hitArea.setVisible(false));
  }

  private dropItem(slotIndex: number): void {
    const slots = this.inventory.getSlots();
    const slot = slots[slotIndex];
    
    console.log('dropItem called for slot:', slotIndex, 'slot data:', slot);
    
    if (slot && slot.itemType && slot.quantity > 0) {
      // Save the item type ID before removing (as removal might null the slot)
      const itemTypeId = slot.itemType.id;
      const itemTypeRef = slot.itemType;
      
      console.log('Attempting to drop:', itemTypeId, 'amount:', 1);
      
      // Drop one item (or you could drop all with slot.quantity)
      const amountToDrop = 1;
      const removed = this.inventory.removeItem(itemTypeRef, amountToDrop);
      console.log('Item removed from inventory:', removed);
      
      this.update();
      
      // Notify GameScene to spawn item on map
      if (this.onDropItem) {
        console.log('Calling onDropItem callback with:', itemTypeId, amountToDrop);
        this.onDropItem(itemTypeId, amountToDrop);
      } else {
        console.log('ERROR: onDropItem callback not set!');
      }
    } else {
      console.log('Cannot drop: slot is empty or invalid');
    }
  }

  public update(): void {
    const slots = this.inventory.getSlots();

    for (let i = 0; i < 4; i++) {
      const slot = slots[i];
      const itemSprite = this.itemSprites[i];
      const quantityText = this.slotTexts[i];

      // Clear previous drawing
      itemSprite.clear();

      if (slot && slot.itemType && slot.quantity > 0) {
        // Draw item icon based on type
        const itemId = slot.itemType.id;
        
        if (itemId === 'berry') {
          this.drawBerry(itemSprite, 24, 24);
        } else if (itemId === 'wood') {
          this.drawWood(itemSprite, 24, 24);
        } else if (itemId === 'stone') {
          this.drawStone(itemSprite, 24, 24);
        }

        // Update quantity text
        quantityText.setText(`${slot.quantity}`);
      } else {
        quantityText.setText('');
      }
    }
  }

  private drawBerry(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number): void {
    // Draw berry as a red circle
    graphics.fillStyle(DarkFantasyPalette.bloodRed, 1);
    graphics.fillCircle(centerX, centerY, 8);
    
    // Add highlight
    graphics.fillStyle(0xff6b6b, 0.5);
    graphics.fillCircle(centerX - 2, centerY - 2, 3);
  }

  private drawWood(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number): void {
    // Draw wood as a brown rectangle
    graphics.fillStyle(DarkFantasyPalette.oldWood, 1);
    graphics.fillRect(centerX - 10, centerY - 6, 20, 12);
    
    // Add wood grain lines
    graphics.lineStyle(1, DarkFantasyPalette.darkBark, 0.5);
    graphics.lineBetween(centerX - 8, centerY - 2, centerX + 8, centerY - 2);
    graphics.lineBetween(centerX - 8, centerY + 2, centerX + 8, centerY + 2);
  }

  private drawStone(graphics: Phaser.GameObjects.Graphics, centerX: number, centerY: number): void {
    // Draw stone as an irregular gray shape
    graphics.fillStyle(DarkFantasyPalette.stoneGray, 1);
    graphics.fillCircle(centerX, centerY, 10);
    
    // Add darker patches for texture
    graphics.fillStyle(DarkFantasyPalette.darkStone, 0.6);
    graphics.fillCircle(centerX - 3, centerY + 2, 4);
    graphics.fillCircle(centerX + 2, centerY - 3, 3);
  }

  public destroy(): void {
    this.container.destroy();
    this.toggleButton.destroy();
    this.toggleButtonText.destroy();
    this.slotHitAreas.forEach(hitArea => hitArea.destroy());
    this.slotGraphics = [];
    this.slotTexts = [];
    this.itemSprites = [];
    this.slotHitAreas = [];
  }
}
