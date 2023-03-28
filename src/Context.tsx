import { createContext, useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';
import {
  findHSpanPoints,
  findVSpanPoints,
  initilizeBox,
  initilizeBoxes
} from './utils';
import {
  type VLine,
  type BoxProps,
  type HLine,
  type BoxExtended
} from './types';

const initialBoxes: BoxProps[] = new Array(10).fill(10).map((_, i) => {
  const width = Math.floor(Math.random() * 500 + 100);
  const height = Math.floor(Math.random() * 500 + 100);

  return {
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    width,
    height,
    x: Math.floor(Math.random() * window.innerWidth) - width,
    y: Math.floor(Math.random() * window.innerHeight) - height
  };
});

interface ContextState {
  boxes: BoxProps[];
  vLines: VLine[];
  hLines: HLine[];
  moveBox: (id: string, x: number, y: number) => void;
}

export const Context = createContext<ContextState>({
  boxes: [],
  vLines: [],
  hLines: [],
  moveBox() {}
});

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { currentOffset, initialOffset, item, isDragging } = useDragLayer(
    (monitor) => ({
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
      item: monitor.getItem()
    })
  );

  const [boxes, setBoxes] = useState(initilizeBoxes(initialBoxes));
  const [vLines, setVLines] = useState<VLine[]>([]);
  const [hLines, setHLines] = useState<HLine[]>([]);

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

  const calculateMatches = (box: BoxExtended) => {
    const otherBoxes = boxes.filter((b) => b.color !== box.color);

    const _hLines = otherBoxes.map((_box) => findHSpanPoints(box, _box)).flat();

    const _vLines = otherBoxes.map((_box) => findVSpanPoints(box, _box)).flat();

    if (hLines !== _hLines) {
      setHLines(_hLines);
    }

    if (vLines !== _vLines) {
      setVLines(_vLines);
    }
  };

  useEffect(() => {
    if (currentOffset != null && initialOffset != null) {
      const { x, y } = currentOffset;
      calculateMatches(initilizeBox({ ...item, x, y }));
    }
  }, [currentOffset, initialOffset, item]);

  useEffect(() => {
    if (!isDragging) {
      setVLines([]);
      setHLines([]);
    }
  }, [isDragging]);

  return (
    <Context.Provider value={{ boxes, vLines, hLines, moveBox }}>
      {children}
    </Context.Provider>
  );
};
