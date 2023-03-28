import { useContext } from 'react';
import { useDragLayer, type XYCoord } from 'react-dnd';
import { Context } from './Context';
import { type VLine, type HLine } from './types';
import { calculateHSpanPoint, calculateVSpanPoint } from './utils';

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
  hLines: HLine[] | null,
  vLines: VLine[] | null
) {
  if (initialOffset == null || currentOffset == null) {
    return {
      display: 'none'
    };
  }
  let { x, y } = currentOffset;

  if (hLines?.[0] != null) {
    y = calculateHSpanPoint(hLines[0]);
  }

  if (vLines?.[0] != null) {
    x = calculateVSpanPoint(vLines[0]);
  }

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform
  };
}

export const DragLayer = () => {
  const { hLines, vLines } = useContext(Context);

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
      <div style={getItemStyles(initialOffset, currentOffset, hLines, vLines)}>
        {renderItem()}
      </div>
    </div>
  );
};
