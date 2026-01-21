# Anchor Items

Anchor items are a special type of grid item that act as obstacles when other items are dragged into them (like static items), but can themselves be dragged and resized (unlike static items).

## When to Use Anchor Items

Use anchor items when you want:

- Items that act as **reference points** or **anchors** that other items flow around
- Items that users can **reposition** but that shouldn't be pushed around by other items
- **Semi-fixed** elements that provide structure but remain flexible

## Comparison: Static vs Anchor

| Behavior                          | Static                          | Anchor                |
| --------------------------------- | ------------------------------- | --------------------- |
| Can be dragged                    | No (unless `isDraggable: true`) | Yes                   |
| Can be resized                    | No (unless `isResizable: true`) | Yes (normal behavior) |
| Acts as obstacle when others drag | Yes                             | Yes                   |
| Doesn't move during compaction    | Yes                             | Yes                   |

## Basic Usage

### Using the `anchor` Property

Simply add `anchor: true` to any layout item:

```tsx
import { GridLayout } from "react-grid-layout";

const layout = [
  { i: "a", x: 0, y: 0, w: 2, h: 2 },
  { i: "b", x: 2, y: 0, w: 2, h: 2, anchor: true }, // Anchor item
  { i: "c", x: 4, y: 0, w: 2, h: 2 }
];

function MyGrid() {
  return (
    <GridLayout layout={layout} cols={12} rowHeight={30} width={1200}>
      <div key="a">Item A - Can be dragged</div>
      <div key="b">Item B - Anchor (acts as obstacle, but can be moved)</div>
      <div key="c">Item C - Can be dragged</div>
    </GridLayout>
  );
}
```

### With Hooks API

```tsx
import { useGridLayout, useContainerWidth } from "react-grid-layout";
import { useState } from "react";

function MyGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useContainerWidth(containerRef);

  const [layout, setLayout] = useState([
    { i: "header", x: 0, y: 0, w: 12, h: 2, anchor: true },
    { i: "sidebar", x: 0, y: 2, w: 3, h: 8, anchor: true },
    { i: "content", x: 3, y: 2, w: 9, h: 8 }
  ]);

  const { onLayoutChange } = useGridLayout({
    layout,
    cols: 12,
    rowHeight: 30,
    width: width || 1200,
    onLayoutChange: setLayout
  });

  return (
    <div ref={containerRef}>
      <GridLayout
        layout={layout}
        onLayoutChange={onLayoutChange}
        // ... other props
      >
        <div key="header">Header (Anchor)</div>
        <div key="sidebar">Sidebar (Anchor)</div>
        <div key="content">Content</div>
      </GridLayout>
    </div>
  );
}
```

## Common Use Cases

### 1. Dashboard with Fixed Header/Sidebar

Create a dashboard where the header and sidebar are anchor items - they can be repositioned by the user, but other widgets flow around them:

```tsx
const dashboardLayout = [
  { i: "header", x: 0, y: 0, w: 12, h: 2, anchor: true },
  { i: "sidebar", x: 0, y: 2, w: 2, h: 10, anchor: true },
  { i: "widget1", x: 2, y: 2, w: 5, h: 3 },
  { i: "widget2", x: 7, y: 2, w: 5, h: 3 },
  { i: "widget3", x: 2, y: 5, w: 10, h: 4 }
];
```

### 2. Reference Points

Use anchor items as reference points that other items align to:

```tsx
const layout = [
  { i: "reference", x: 6, y: 0, w: 1, h: 1, anchor: true },
  { i: "item1", x: 0, y: 0, w: 3, h: 2 },
  { i: "item2", x: 3, y: 0, w: 3, h: 2 }
  // When dragging item1 or item2, they will flow around the reference point
  // But the reference point itself can be moved
];
```

### 3. Flexible Templates

Create templates where certain "structural" elements are anchors but can be customized:

```tsx
const templateLayout = [
  { i: "title", x: 0, y: 0, w: 12, h: 1, anchor: true },
  { i: "image", x: 0, y: 1, w: 6, h: 4, anchor: true },
  { i: "text1", x: 6, y: 1, w: 6, h: 2 },
  { i: "text2", x: 6, y: 3, w: 6, h: 2 }
];
```

## Behavior Details

### During Dragging

- **Dragging an anchor item**: The anchor item moves normally, and other items may compact around its new position
- **Dragging into an anchor item**: The dragged item is moved away from the anchor (the anchor stays in place)

### During Compaction

- Anchor items **do not move** during compaction
- Other items **flow around** anchor items
- Anchor items are treated the same as static items for compaction purposes

### Interaction with Static Items

- Anchor items and static items both act as obstacles
- You can have both in the same layout
- Static items cannot be dragged (unless `isDraggable: true`)
- Anchor items can be dragged normally

## API Reference

### LayoutItem.anchor

```typescript
interface LayoutItem {
  // ... other properties
  /**
   * If true, item acts as an obstacle when other items are dragged into it
   * (like static items), but the item itself can still be dragged and resized.
   * Other items will move around it during compaction, but the anchor item
   * can be moved when directly manipulated.
   */
  anchor?: boolean;
}
```

## Examples

See the example file at `test/examples/22-anchor-elements.jsx` for a complete working example.

## Migration from Static

If you have static items that you want to make draggable:

```diff
const layout = [
-  { i: 'item', x: 0, y: 0, w: 2, h: 2, static: true },
+  { i: 'item', x: 0, y: 0, w: 2, h: 2, anchor: true },
];
```

**Note**: Unlike static items, anchor items don't require `isDraggable: true` to be draggable - they are draggable by default.
