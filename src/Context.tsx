import { createContext, useEffect, useState } from 'react';
import { useDragDropManager } from 'react-dnd';
import {
  findLines,
  findNearEgdes,
  initilizeBox,
  initilizeBoxes,
  spanPoint
} from './utils';
import {
  type VLine,
  type BoxProps,
  type HLine,
  type EdgeMatched
} from './types';

const sizes = [200, 300, 200, 250, 400, 150];

const initialBoxes: BoxProps[] = sizes.map((size) => ({
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  width: size,
  height: size,
  x: Math.max(Math.floor(Math.random() * window.innerWidth) - size, 0),
  y: Math.max(Math.floor(Math.random() * window.innerHeight) - size, 0)
}));

interface ContextState {
  boxes: BoxProps[];
  vLines: VLine[];
  hLines: HLine[];
  matches: EdgeMatched[];
  snapedMatches: EdgeMatched[];
  moveBox: (id: string, x: number, y: number) => void;
}

export const Context = createContext<ContextState>({
  boxes: [],
  vLines: [],
  hLines: [],
  matches: [],
  snapedMatches: [],
  moveBox() {}
});

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const dragDropManager = useDragDropManager();

  const [boxes, setBoxes] = useState(initilizeBoxes(initialBoxes));
  const [matches, setMatches] = useState<EdgeMatched[]>([]);
  const [snapedMatches, setSnapedMatches] = useState<EdgeMatched[]>([]);

  const [lines, setLines] = useState<{
    vLines: VLine[];
    hLines: HLine[];
  }>({ vLines: [], hLines: [] });

  const moveBox = (id: string, x: number, y: number) => {
    const boxIndex = boxes.findIndex((box) => box.color === id);

    if (boxIndex === -1) {
      return;
    }

    const newBoxes = [...boxes];
    newBoxes[boxIndex] = initilizeBox({
      ...newBoxes[boxIndex],
      x,
      y
    });

    setBoxes(newBoxes);
  };

  const reset = () => {
    setMatches([]);
    setSnapedMatches([]);
    setLines({ hLines: [], vLines: [] });
  };

  useEffect(() => {
    const unsubscibe = dragDropManager
      .getMonitor()
      .subscribeToOffsetChange(() => {
        const monitor = dragDropManager.getMonitor();
        const contentOffset = monitor.getSourceClientOffset();
        const item = monitor.getItem();

        if (contentOffset !== null && item !== null) {
          // find possible matches
          const matches = findNearEgdes(
            initilizeBox({
              ...item,
              x: contentOffset.x,
              y: contentOffset.y
            }),
            boxes.filter((box) => box.color !== item.color)
          );

          const snapedMatches = findNearEgdes(
            initilizeBox({
              ...item,
              ...spanPoint(
                initilizeBox({
                  ...item,
                  x: contentOffset.x,
                  y: contentOffset.y
                }),
                matches
              )
            }),
            boxes.filter((box) => box.color !== item.color),
            1
          );

          setMatches(matches);
          setSnapedMatches(snapedMatches);
          // set lines on snap points
          setLines(findLines(snapedMatches));
        }
      });

    const unsubscribeStateChange = dragDropManager
      .getMonitor()
      .subscribeToStateChange(() => {
        const monitor = dragDropManager.getMonitor();

        if (!monitor.isDragging()) {
          reset();
        }
      });

    return () => {
      unsubscibe();
      unsubscribeStateChange();
    };
  }, [boxes, reset]);

  return (
    <Context.Provider
      value={{
        boxes,
        vLines: lines.vLines,
        hLines: lines.hLines,
        moveBox,
        matches,
        snapedMatches
      }}
    >
      {children}
    </Context.Provider>
  );
};
