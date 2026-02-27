export interface InventoryItemType {
  id: string;
  name: string;
  spacePerUnit: number; // How much inventory space one unit takes
}

export const ITEM_TYPES: Record<string, InventoryItemType> = {
  BERRY: {
    id: 'berry',
    name: 'Berries',
    spacePerUnit: 0.1
  },
  WOOD: {
    id: 'wood',
    name: 'Wood',
    spacePerUnit: 1
  },
  STONE: {
    id: 'stone',
    name: 'Stone',
    spacePerUnit: 1
  }
};
