import { useContext } from 'react';
import { useDragLayer, type XYCoord } from 'react-dnd';
import { Context } from './Context';
import { type EdgeMatched, type BoxExtended } from './types';
import { initializeBox, spanPoint } from './utils';

const layerStyles: React.CSSProperties = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null,
  item: BoxExtended,
  matches: EdgeMatched[]
) {
  if (initialOffset == null || currentOffset == null) {
    return {
      display: 'none'
    };
  }
  const { x, y } = spanPoint(
    initializeBox({
      ...item,
      x: currentOffset.x,
      y: currentOffset.y
    }),
    matches
  );

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

export const DragLayer = () => {
  const { matches } = useContext(Context);

  const { isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging()
    })
  );
  function renderItem() {
    return (
      <div
        style={{
          height: item.height,
          width: item.width,
          backgroundColor: item.color
        }}
      />
    );
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset, item, matches)}>
        {renderItem()}
      </div>
    </div>
  );
};
