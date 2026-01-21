import React from "react";
import RGL, { WidthProvider } from "react-grid-layout";

const ReactGridLayout = WidthProvider(RGL);

/**
 * This layout demonstrates how to use anchor grid elements.
 * Anchor elements act as obstacles when other items are dragged into them
 * (like static elements), but can themselves be dragged and resized.
 */
export default class AnchorElementsLayout extends React.PureComponent {
  constructor(props) {
    super(props);

    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }

  render() {
    return (
      <ReactGridLayout
        className="layout"
        onLayoutChange={this.onLayoutChange}
        rowHeight={30}
        cols={12}
      >
        <div key="1" data-grid={{ x: 0, y: 0, w: 2, h: 3 }}>
          <span className="text">1 - Draggable</span>
        </div>
        <div key="2" data-grid={{ x: 2, y: 0, w: 4, h: 3, anchor: true }}>
          <span className="text">2 - Anchor (can be dragged, acts as obstacle)</span>
        </div>
        <div key="3" data-grid={{ x: 6, y: 0, w: 2, h: 3 }}>
          <span className="text">3 - Draggable</span>
        </div>
        <div key="4" data-grid={{ x: 8, y: 0, w: 4, h: 3 }}>
          <span className="text">4 - Draggable</span>
        </div>
        <div key="5" data-grid={{ x: 0, y: 3, w: 6, h: 3 }}>
          <span className="text">5 - Try dragging this into item 2</span>
        </div>
        <div key="6" data-grid={{ x: 6, y: 3, w: 6, h: 3 }}>
          <span className="text">6 - Draggable</span>
        </div>
        <div key="7" data-grid={{ x: 0, y: 6, w: 12, h: 2, anchor: true }}>
          <span className="text">7 - Anchor Footer (can be moved, but other items flow around it)</span>
        </div>
      </ReactGridLayout>
    );
  }
}

if (process.env.STATIC_EXAMPLES === true) {
  import("../test-hook.jsx").then(fn => fn.default(AnchorElementsLayout));
}
