import { type XYCoord, useDrop } from 'react-dnd';
import { Context } from './Context';
import React, { useContext, useMemo } from 'react';
import Box from './Box';
import { type HLine, type BoxProps, type VLine } from './types';
import { initializeBox, spanPoint } from './utils';

const styles: React.CSSProperties = {
  backgroundColor: '#f1f1f1',
  width: '100%',
  height: '100vh',
  position: 'relative'
};

const getHLineStyle = (hLine: HLine): React.CSSProperties => ({
  position: 'absolute',
  width: hLine.x2 - hLine.x1,
  top: hLine.y,
  height: 1,
  background: 'red',
  left: hLine.x1,
  zIndex: 1000
});

const getVLineStyle = (hLine: VLine): React.CSSProperties => ({
  position: 'absolute',
  height: hLine.y2 - hLine.y1,
  left: hLine.x,
  width: 1,
  background: 'red',
  top: hLine.y1,
  zIndex: 1000
});

export const DropArea: React.FC = () => {
  const { boxes, moveBox, hLines, vLines, matches, snapedMatches } =
    useContext(Context);

  const [, dropRef] = useDrop(
    () => ({
      accept: 'box',
      drop(item: BoxProps, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset() as XYCoord;

        const { x, y } = spanPoint(
          initializeBox({
            ...item,
            x: Math.round(item.x + delta.x),
            y: Math.round(item.y + delta.y)
          }),
          matches
        );

        moveBox(item.color, x, y);
        return undefined;
      }
    }),
    [moveBox, matches]
  );

  const activeColors = useMemo(() => {
    const activeColors = snapedMatches.map((match) => {
      return match.box.color;
    });

    return activeColors;
  }, [snapedMatches]);

  return (
    <div style={styles} ref={dropRef}>
      {boxes.map((box) => (
        <Box
          key={box.color}
          {...box}
          active={activeColors.includes(box.color)}
        />
      ))}

      {React.Children.toArray(
        hLines.map((hLine) => <div style={getHLineStyle(hLine)} />)
      )}

      {React.Children.toArray(
        vLines.map((vLine) => <div style={getVLineStyle(vLine)} />)
      )}
    </div>
  );
};
