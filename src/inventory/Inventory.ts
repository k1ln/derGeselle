import { ITEM_TYPES, InventoryItemType } from './InventoryItem';

export interface InventorySlot {
  itemType: InventoryItemType | null;
  quantity: number;
}

export class Inventory {
  private slots: InventorySlot[];
  private maxSlots: number;
  private spacePerSlot: number;
  private hasBag: boolean;

  constructor(hasBag: boolean = false) {
    this.hasBag = hasBag;
    this.maxSlots = hasBag ? 10 : 4; // More slots with bag
    this.spacePerSlot = 10; // Each slot can hold up to 10 "space units"
    this.slots = [];
    
    // Initialize empty slots
    for (let i = 0; i < this.maxSlots; i++) {
      this.slots.push({ itemType: null, quantity: 0 });
    }
  }

  /**
   * Try to add an item to the inventory
   * @returns true if item was added, false if inventory is full
   */
  addItem(itemType: InventoryItemType, amount: number = 1): boolean {
    let remainingAmount = amount;

    // First, try to add to existing stacks of the same item
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.itemType?.id === itemType.id) {
        const currentSpace = slot.quantity * itemType.spacePerUnit;
        const maxUnits = Math.floor(this.spacePerSlot / itemType.spacePerUnit);
        const spaceForMore = maxUnits - slot.quantity;

        if (spaceForMore > 0) {
          const toAdd = Math.min(spaceForMore, remainingAmount);
          slot.quantity += toAdd;
          remainingAmount -= toAdd;

          if (remainingAmount <= 0) {
            return true;
          }
        }
      }
    }

    // Then try to add to empty slots
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.itemType === null) {
        const maxUnits = Math.floor(this.spacePerSlot / itemType.spacePerUnit);
        const toAdd = Math.min(maxUnits, remainingAmount);
        
        slot.itemType = itemType;
        slot.quantity = toAdd;
        remainingAmount -= toAdd;

        if (remainingAmount <= 0) {
          return true;
        }
      }
    }

    // If we still have remaining items, inventory is full
    return remainingAmount <= 0;
  }

  /**
   * Remove an item from the inventory
   * @returns true if item was removed, false if not enough items
   */
  removeItem(itemType: InventoryItemType, amount: number = 1): boolean {
    let remainingAmount = amount;

    // Remove from slots, starting from the first slot with this item
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (slot.itemType?.id === itemType.id && slot.quantity > 0) {
        const toRemove = Math.min(slot.quantity, remainingAmount);
        slot.quantity -= toRemove;
        remainingAmount -= toRemove;

        // Clear slot if empty
        if (slot.quantity <= 0) {
          slot.itemType = null;
          slot.quantity = 0;
        }

        if (remainingAmount <= 0) {
          return true;
        }
      }
    }

    return remainingAmount <= 0;
  }

  /**
   * Get the total quantity of an item in the inventory
   */
  getItemCount(itemType: InventoryItemType): number {
    let total = 0;
    for (const slot of this.slots) {
      if (slot.itemType?.id === itemType.id) {
        total += slot.quantity;
      }
    }
    return total;
  }

  /**
   * Get all slots
   */
  getSlots(): InventorySlot[] {
    return this.slots;
  }

  /**
   * Check if inventory has space for an item
   */
  hasSpaceFor(itemType: InventoryItemType, amount: number = 1): boolean {
    let remainingAmount = amount;

    // Check existing stacks
    for (const slot of this.slots) {
      if (slot.itemType?.id === itemType.id) {
        const maxUnits = Math.floor(this.spacePerSlot / itemType.spacePerUnit);
        const spaceForMore = maxUnits - slot.quantity;
        remainingAmount -= spaceForMore;

        if (remainingAmount <= 0) {
          return true;
        }
      }
    }

    // Check empty slots
    for (const slot of this.slots) {
      if (slot.itemType === null) {
        const maxUnits = Math.floor(this.spacePerSlot / itemType.spacePerUnit);
        remainingAmount -= maxUnits;

        if (remainingAmount <= 0) {
          return true;
        }
      }
    }

    return remainingAmount <= 0;
  }

  /**
   * Get total used and available space info
   */
  getSpaceInfo(): { usedSlots: number; totalSlots: number } {
    let usedSlots = 0;
    for (const slot of this.slots) {
      if (slot.itemType !== null) {
        usedSlots++;
      }
    }
    return { usedSlots, totalSlots: this.maxSlots };
  }
}
