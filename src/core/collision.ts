/**
 * Collision detection utilities for grid layouts.
 *
 * These functions determine if and where layout items overlap.
 */

import type { Layout, LayoutItem } from "./types.js";

/**
 * Check if two layout items collide (overlap).
 *
 * Two items collide if their bounding boxes overlap by at least the threshold
 * amount and they are not the same item.
 *
 * @param l1 - First layout item
 * @param l2 - Second layout item
 * @param threshold - Minimum overlap in grid units required for collision (default: 0)
 * @returns true if the items collide
 */
export function collides(
  l1: LayoutItem,
  l2: LayoutItem,
  threshold: number = 0
): boolean {
  // Same element - can't collide with itself
  if (l1.i === l2.i) return false;

  // Check if bounding boxes don't overlap by at least threshold
  // Items must overlap by at least threshold in both dimensions
  if (l1.x + l1.w <= l2.x + threshold) return false; // l1 is too far left of l2
  if (l1.x >= l2.x + l2.w - threshold) return false; // l1 is too far right of l2
  if (l1.y + l1.h <= l2.y + threshold) return false; // l1 is too far above l2
  if (l1.y >= l2.y + l2.h - threshold) return false; // l1 is too far below l2

  // Bounding boxes overlap by at least threshold
  return true;
}

/**
 * Find the first item in the layout that collides with the given item.
 *
 * @param layout - Layout to search
 * @param layoutItem - Item to check for collisions
 * @param threshold - Minimum overlap in grid units required for collision (default: 0)
 * @returns The first colliding item, or undefined if none
 */
export function getFirstCollision(
  layout: Layout,
  layoutItem: LayoutItem,
  threshold: number = 0
): LayoutItem | undefined {
  for (let i = 0; i < layout.length; i++) {
    const item = layout[i];
    if (item !== undefined && collides(item, layoutItem, threshold)) {
      return item;
    }
  }
  return undefined;
}

/**
 * Find all items in the layout that collide with the given item.
 *
 * @param layout - Layout to search
 * @param layoutItem - Item to check for collisions
 * @param threshold - Minimum overlap in grid units required for collision (default: 0)
 * @returns Array of all colliding items (may be empty)
 */
export function getAllCollisions(
  layout: Layout,
  layoutItem: LayoutItem,
  threshold: number = 0
): LayoutItem[] {
  return layout.filter((l): l is LayoutItem =>
    collides(l, layoutItem, threshold)
  );
}
