import {
  type VLine,
  type BoxExtended,
  type BoxProps,
  type HLine
} from './types';

export const THRESHOLD = 20;

export const calculateHSpanPoint = (hLine: HLine) => {
  const origin = hLine.origin[0];

  if (origin === 'bottom') {
    return hLine.y - hLine.elements[0].height;
  }

  if (origin === 'middleH') {
    return hLine.y - hLine.elements[0].height / 2;
  }

  return hLine.y;
};

export const calculateVSpanPoint = (vLine: VLine) => {
  const origin = vLine.origin[0];

  if (origin === 'right') {
    return vLine.x - vLine.elements[0].width;
  }

  if (origin === 'middleV') {
    return vLine.x - vLine.elements[0].width / 2;
  }

  return vLine.x;
};

export const uniqueLines = <T>(lines: HLine[] | VLine[]): T => {
  return [
    ...new Map(lines.map((line) => [line.elements[1].color, line])).values()
  ] as T;
};

export const initilizeBox = (box: BoxProps): BoxExtended => ({
  ...box,
  top: box.y,
  left: box.x,
  bottom: box.y + box.height,
  right: box.x + box.width,
  middleH: box.y + box.height / 2,
  middleV: box.x + box.width / 2
});

type hEdges = keyof Pick<BoxExtended, 'top' | 'bottom' | 'middleH'>;
type vEdges = keyof Pick<BoxExtended, 'left' | 'right' | 'middleV'>;

const compareh = (
  box1: BoxExtended,
  box2: BoxExtended,
  obj1: hEdges,
  obj2: hEdges
): HLine | null => {
  if (
    box1[obj1] < box2[obj2] + THRESHOLD &&
    box1[obj1] > box2[obj2] - THRESHOLD
  ) {
    const x1 = box1.x < box2.x ? box1.x : box2.x;
    const x2 = box1.x < box2.x ? box2.right : box1.right;

    return {
      x1,
      x2,
      y: box2[obj2],
      elements: [box1, box2],
      origin: [obj1, obj2],
      showBorder: box1[obj1] === box2[obj2]
    };
  }

  return null;
};

const comparev = (
  box1: BoxExtended,
  box2: BoxExtended,
  obj1: vEdges,
  obj2: vEdges
): VLine | null => {
  if (
    box1[obj1] < box2[obj2] + THRESHOLD &&
    box1[obj1] > box2[obj2] - THRESHOLD
  ) {
    const y1 = box1.y < box2.y ? box1.y : box2.y;
    const y2 = box1.y < box2.y ? box2.bottom : box1.bottom;

    return {
      y1,
      y2,
      x: box2[obj2],
      elements: [box1, box2],
      origin: [obj1, obj2],
      showBorder: box1[obj1] === box2[obj2]
    };
  }

  return null;
};

export const findHSpanPoints = (
  box1: BoxExtended,
  box2: BoxExtended
): HLine[] => {
  // horzantal line

  let res;

  const edges: hEdges[] = ['top', 'middleH', 'bottom'];

  const matches: HLine[] = [];

  edges.forEach((edge) => {
    edges.forEach((edge2) => {
      if ((res = compareh(box1, box2, edge, edge2)) != null) {
        matches.push(res);
      }
    });
  });

  return matches;
};

export const findVSpanPoints = (
  box1: BoxExtended,
  box2: BoxExtended
): VLine[] => {
  // vertical line

  let res;

  const edges: vEdges[] = ['left', 'middleV', 'right'];

  const matches: VLine[] = [];

  edges.forEach((edge) => {
    edges.forEach((edge2) => {
      if ((res = comparev(box1, box2, edge, edge2)) != null) {
        matches.push(res);
      }
    });
  });

  return matches;
};

export const initilizeBoxes = (boxes: BoxProps[]) => boxes.map(initilizeBox);
