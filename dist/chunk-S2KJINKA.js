'use strict';

var chunkLUT42EQL_js = require('./chunk-LUT42EQL.js');
var chunkNTZV4CE2_js = require('./chunk-NTZV4CE2.js');
var react = require('react');
var fastEquals = require('fast-equals');

function useContainerWidth(options = {}) {
  const { measureBeforeMount = false, initialWidth = 1280 } = options;
  const [width, setWidth] = react.useState(initialWidth);
  const [mounted, setMounted] = react.useState(!measureBeforeMount);
  const containerRef = react.useRef(null);
  const observerRef = react.useRef(null);
  const measureWidth = react.useCallback(() => {
    const node = containerRef.current;
    if (node) {
      const newWidth = node.offsetWidth;
      setWidth(newWidth);
      if (!mounted) {
        setMounted(true);
      }
    }
  }, [mounted]);
  react.useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    measureWidth();
    if (typeof ResizeObserver !== "undefined") {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const newWidth = entry.contentRect.width;
          setWidth(newWidth);
        }
      });
      observerRef.current.observe(node);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [measureWidth]);
  return {
    width,
    mounted,
    containerRef,
    measureWidth
  };
}
function useGridLayout(options) {
  const {
    layout: propsLayout,
    cols,
    compactType = "vertical",
    allowOverlap = false,
    preventCollision = false,
    collisionThreshold = 0,
    onLayoutChange
  } = options;
  const compactor = react.useMemo(
    () => chunkLUT42EQL_js.getCompactor(compactType, allowOverlap),
    [compactType, allowOverlap]
  );
  const isDraggingRef = react.useRef(false);
  const [layout, setLayoutState] = react.useState(() => {
    const corrected = chunkNTZV4CE2_js.correctBounds(chunkNTZV4CE2_js.cloneLayout(propsLayout), { cols });
    return chunkLUT42EQL_js.compact(corrected, compactType, cols, allowOverlap);
  });
  const [dragState, setDragState] = react.useState({
    activeDrag: null,
    oldDragItem: null,
    oldLayout: null
  });
  const [resizeState, setResizeState] = react.useState({
    resizing: false,
    oldResizeItem: null,
    oldLayout: null
  });
  const [dropState, setDropState] = react.useState({
    droppingDOMNode: null,
    droppingPosition: null
  });
  const prevLayoutRef = react.useRef(layout);
  const setLayout = react.useCallback(
    (newLayout) => {
      const corrected = chunkNTZV4CE2_js.correctBounds(chunkNTZV4CE2_js.cloneLayout(newLayout), { cols });
      const compacted = chunkLUT42EQL_js.compact(corrected, compactType, cols, allowOverlap);
      setLayoutState(compacted);
    },
    [cols, compactType, allowOverlap]
  );
  react.useEffect(() => {
    if (isDraggingRef.current) return;
    if (!fastEquals.deepEqual(propsLayout, prevLayoutRef.current)) {
      setLayout(propsLayout);
    }
  }, [propsLayout, setLayout]);
  react.useEffect(() => {
    if (!fastEquals.deepEqual(layout, prevLayoutRef.current)) {
      prevLayoutRef.current = layout;
      onLayoutChange?.(layout);
    }
  }, [layout, onLayoutChange]);
  const onDragStart = react.useCallback(
    (itemId, x, y) => {
      const item = chunkNTZV4CE2_js.getLayoutItem(layout, itemId);
      if (!item) return null;
      isDraggingRef.current = true;
      const placeholder = {
        ...chunkNTZV4CE2_js.cloneLayoutItem(item),
        x,
        y,
        static: false,
        moved: false
      };
      setDragState({
        activeDrag: placeholder,
        oldDragItem: chunkNTZV4CE2_js.cloneLayoutItem(item),
        oldLayout: chunkNTZV4CE2_js.cloneLayout(layout)
      });
      return placeholder;
    },
    [layout]
  );
  const onDrag = react.useCallback(
    (itemId, x, y) => {
      const item = chunkNTZV4CE2_js.getLayoutItem(layout, itemId);
      if (!item) return;
      setDragState((prev) => ({
        ...prev,
        activeDrag: prev.activeDrag ? { ...prev.activeDrag, x, y } : null
      }));
      const newLayout = chunkNTZV4CE2_js.moveElement(
        layout,
        item,
        x,
        y,
        true,
        // isUserAction
        preventCollision,
        compactType,
        cols,
        allowOverlap,
        collisionThreshold
      );
      const compacted = allowOverlap ? newLayout : chunkLUT42EQL_js.compact(newLayout, compactType, cols);
      setLayoutState(compacted);
    },
    [
      layout,
      cols,
      compactType,
      preventCollision,
      allowOverlap,
      collisionThreshold
    ]
  );
  const onDragStop = react.useCallback(
    (itemId, x, y) => {
      const item = chunkNTZV4CE2_js.getLayoutItem(layout, itemId);
      if (!item) return;
      const newLayout = chunkNTZV4CE2_js.moveElement(
        layout,
        item,
        x,
        y,
        true,
        preventCollision,
        compactType,
        cols,
        allowOverlap,
        collisionThreshold
      );
      const compacted = chunkLUT42EQL_js.compact(newLayout, compactType, cols, allowOverlap);
      isDraggingRef.current = false;
      setDragState({
        activeDrag: null,
        oldDragItem: null,
        oldLayout: null
      });
      setLayoutState(compacted);
    },
    [layout, cols, compactType, preventCollision, allowOverlap]
  );
  const onResizeStart = react.useCallback(
    (itemId) => {
      const item = chunkNTZV4CE2_js.getLayoutItem(layout, itemId);
      if (!item) return null;
      setResizeState({
        resizing: true,
        oldResizeItem: chunkNTZV4CE2_js.cloneLayoutItem(item),
        oldLayout: chunkNTZV4CE2_js.cloneLayout(layout)
      });
      return item;
    },
    [layout]
  );
  const onResize = react.useCallback(
    (itemId, w, h, x, y) => {
      const newLayout = layout.map((item) => {
        if (item.i === itemId) {
          const updated = {
            ...item,
            w,
            h
          };
          if (x !== void 0) updated.x = x;
          if (y !== void 0) updated.y = y;
          return updated;
        }
        return item;
      });
      const corrected = chunkNTZV4CE2_js.correctBounds(newLayout, { cols });
      const compacted = chunkLUT42EQL_js.compact(corrected, compactType, cols, allowOverlap);
      setLayoutState(compacted);
    },
    [layout, cols, compactType, allowOverlap]
  );
  const onResizeStop = react.useCallback(
    (itemId, w, h) => {
      onResize(itemId, w, h);
      setResizeState({
        resizing: false,
        oldResizeItem: null,
        oldLayout: null
      });
    },
    [onResize]
  );
  const onDropDragOver = react.useCallback(
    (droppingItem, position) => {
      const existingItem = chunkNTZV4CE2_js.getLayoutItem(layout, droppingItem.i);
      if (!existingItem) {
        const newLayout = [...layout, droppingItem];
        const corrected = chunkNTZV4CE2_js.correctBounds(newLayout, { cols });
        const compacted = chunkLUT42EQL_js.compact(corrected, compactType, cols, allowOverlap);
        setLayoutState(compacted);
      }
      setDropState({
        droppingDOMNode: null,
        // Will be set by component
        droppingPosition: position
      });
    },
    [layout, cols, compactType, allowOverlap]
  );
  const onDropDragLeave = react.useCallback(() => {
    const newLayout = layout.filter((item) => item.i !== "__dropping-elem__");
    setLayoutState(newLayout);
    setDropState({
      droppingDOMNode: null,
      droppingPosition: null
    });
  }, [layout]);
  const onDrop = react.useCallback(
    (droppingItem) => {
      const newLayout = layout.map((item) => {
        if (item.i === "__dropping-elem__") {
          return {
            ...item,
            i: droppingItem.i,
            static: false
          };
        }
        return item;
      });
      const corrected = chunkNTZV4CE2_js.correctBounds(newLayout, { cols });
      const compacted = chunkLUT42EQL_js.compact(corrected, compactType, cols, allowOverlap);
      setLayoutState(compacted);
      setDropState({
        droppingDOMNode: null,
        droppingPosition: null
      });
    },
    [layout, cols, compactType, allowOverlap]
  );
  const containerHeight = react.useMemo(() => chunkNTZV4CE2_js.bottom(layout), [layout]);
  const isInteracting = dragState.activeDrag !== null || resizeState.resizing || dropState.droppingPosition !== null;
  return {
    layout,
    setLayout,
    dragState,
    resizeState,
    dropState,
    onDragStart,
    onDrag,
    onDragStop,
    onResizeStart,
    onResize,
    onResizeStop,
    onDropDragOver,
    onDropDragLeave,
    onDrop,
    containerHeight,
    isInteracting,
    compactor
  };
}
var DEFAULT_BREAKPOINTS = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
};
var DEFAULT_COLS = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
};
function useResponsiveLayout(options) {
  const {
    width,
    breakpoints = DEFAULT_BREAKPOINTS,
    cols: colsConfig = DEFAULT_COLS,
    layouts: propsLayouts = {},
    compactType = "vertical",
    onBreakpointChange,
    onLayoutChange,
    onWidthChange
  } = options;
  const sortedBreakpoints = react.useMemo(
    () => chunkLUT42EQL_js.sortBreakpoints(breakpoints),
    [breakpoints]
  );
  const initialBreakpoint = react.useMemo(
    () => chunkLUT42EQL_js.getBreakpointFromWidth(breakpoints, width),
    // Only calculate on mount, not on width changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const initialCols = react.useMemo(
    () => chunkLUT42EQL_js.getColsFromBreakpoint(initialBreakpoint, colsConfig),
    [initialBreakpoint, colsConfig]
  );
  const [breakpoint, setBreakpoint] = react.useState(initialBreakpoint);
  const [cols, setCols] = react.useState(initialCols);
  const [layouts, setLayoutsState] = react.useState(() => {
    const cloned = {};
    for (const bp of sortedBreakpoints) {
      const layout2 = propsLayouts[bp];
      if (layout2) {
        cloned[bp] = chunkNTZV4CE2_js.cloneLayout(layout2);
      }
    }
    return cloned;
  });
  const prevWidthRef = react.useRef(width);
  const prevBreakpointRef = react.useRef(breakpoint);
  const prevPropsLayoutsRef = react.useRef(propsLayouts);
  const prevLayoutsRef = react.useRef(layouts);
  const layout = react.useMemo(() => {
    return chunkLUT42EQL_js.findOrGenerateResponsiveLayout(
      layouts,
      breakpoints,
      breakpoint,
      prevBreakpointRef.current,
      cols,
      compactType
    );
  }, [layouts, breakpoints, breakpoint, cols, compactType]);
  const setLayoutForBreakpoint = react.useCallback((bp, newLayout) => {
    setLayoutsState((prev) => ({
      ...prev,
      [bp]: chunkNTZV4CE2_js.cloneLayout(newLayout)
    }));
  }, []);
  const setLayouts = react.useCallback((newLayouts) => {
    const cloned = {};
    for (const bp of Object.keys(newLayouts)) {
      const layoutForBp = newLayouts[bp];
      if (layoutForBp) {
        cloned[bp] = chunkNTZV4CE2_js.cloneLayout(layoutForBp);
      }
    }
    setLayoutsState(cloned);
  }, []);
  react.useEffect(() => {
    if (prevWidthRef.current === width) return;
    prevWidthRef.current = width;
    const newBreakpoint = chunkLUT42EQL_js.getBreakpointFromWidth(breakpoints, width);
    const newCols = chunkLUT42EQL_js.getColsFromBreakpoint(newBreakpoint, colsConfig);
    onWidthChange?.(width, [10, 10], newCols, null);
    if (newBreakpoint !== breakpoint) {
      const newLayout = chunkLUT42EQL_js.findOrGenerateResponsiveLayout(
        layouts,
        breakpoints,
        newBreakpoint,
        breakpoint,
        newCols,
        compactType
      );
      const updatedLayouts = {
        ...layouts,
        [newBreakpoint]: newLayout
      };
      setLayoutsState(updatedLayouts);
      setBreakpoint(newBreakpoint);
      setCols(newCols);
      onBreakpointChange?.(newBreakpoint, newCols);
      prevBreakpointRef.current = newBreakpoint;
    }
  }, [
    width,
    breakpoints,
    colsConfig,
    breakpoint,
    layouts,
    compactType,
    onBreakpointChange,
    onWidthChange
  ]);
  react.useEffect(() => {
    if (!fastEquals.deepEqual(propsLayouts, prevPropsLayoutsRef.current)) {
      setLayouts(propsLayouts);
      prevPropsLayoutsRef.current = propsLayouts;
    }
  }, [propsLayouts, setLayouts]);
  react.useEffect(() => {
    if (!fastEquals.deepEqual(layouts, prevLayoutsRef.current)) {
      prevLayoutsRef.current = layouts;
      onLayoutChange?.(layout, layouts);
    }
  }, [layout, layouts, onLayoutChange]);
  return {
    layout,
    layouts,
    breakpoint,
    cols,
    setLayoutForBreakpoint,
    setLayouts,
    sortedBreakpoints
  };
}

exports.DEFAULT_BREAKPOINTS = DEFAULT_BREAKPOINTS;
exports.DEFAULT_COLS = DEFAULT_COLS;
exports.useContainerWidth = useContainerWidth;
exports.useGridLayout = useGridLayout;
exports.useResponsiveLayout = useResponsiveLayout;
//# sourceMappingURL=chunk-S2KJINKA.js.map
//# sourceMappingURL=chunk-S2KJINKA.js.map