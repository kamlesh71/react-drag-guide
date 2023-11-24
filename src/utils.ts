import {
  type VLine,
  type BoxExtended,
  type BoxProps,
  type Edges,
  type HLine,
  type EdgeMatched
} from './types';

export const THRESHOLD = 10;

const hEdges: Edges[] = ['l', 'lr', 'r'];
const vEdges: Edges[] = ['t', 'tb', 'b'];

export const compare = (val1: number, val2: number, threshold: number) => {
  return Math.abs(val1 - val2) < threshold;
};

export const spanPoint = (dragginBox: BoxExtended, matches: EdgeMatched[]) => {
  let x = dragginBox.x;
  let y = dragginBox.y;

  matches.forEach((match) => {
    if (vEdges.includes(match.boxEdge)) {
      if (match.dragginBoxEgde === 't') {
        y = match.box[match.boxEdge];
      } else if (match.dragginBoxEgde === 'tb') {
        y = match.box[match.boxEdge] - match.dragginBox.height / 2;
      } else {
        y = match.box[match.boxEdge] - match.dragginBox.height;
      }
    } else {
      if (match.dragginBoxEgde === 'r') {
        x = match.box[match.boxEdge] - match.dragginBox.width;
      } else if (match.dragginBoxEgde === 'lr') {
        x = match.box[match.boxEdge] - match.dragginBox.width / 2;
      } else {
        x = match.box[match.boxEdge];
      }
    }
  });

  return { x, y };
};

export const findLines = (snapedMatches: EdgeMatched[]) => {
  const vLines: VLine[] = [];
  const hLines: HLine[] = [];

  snapedMatches.forEach((match) => {
    const { box, dragginBox } = match;
    if (['l', 'lr', 'r'].includes(match.boxEdge)) {
      vLines.push({
        y1: box.t < dragginBox.t ? box.t : dragginBox.t,
        y2: box.b < dragginBox.b ? dragginBox.b : box.b,
        x: box[match.boxEdge]
      });
    } else {
      hLines.push({
        x1: box.l < dragginBox.l ? box.l : dragginBox.l,
        x2: box.r < dragginBox.r ? dragginBox.r : box.r,
        y: box[match.boxEdge]
      });
    }
  });

  return { vLines, hLines };
};

export const findNearEgdes = (
  draggingBox: BoxExtended,
  otherBoxes: BoxExtended[],
  threshold: number = THRESHOLD
) => {
  const allMatches: EdgeMatched[] = [];

  otherBoxes.forEach((box) => {
    hEdges.forEach((edge1) => {
      hEdges.forEach((edge2) => {
        if (compare(draggingBox[edge1], box[edge2], threshold)) {
          allMatches.push({
            dragginBox: draggingBox,
            dragginBoxEgde: edge1,
            box,
            boxEdge: edge2
          });
        }
      });
    });
  });

  otherBoxes.forEach((box) => {
    vEdges.forEach((edge1) => {
      vEdges.forEach((edge2) => {
        if (compare(draggingBox[edge1], box[edge2], threshold)) {
          allMatches.push({
            dragginBox: draggingBox,
            dragginBoxEgde: edge1,
            box,
            boxEdge: edge2
          });
        }
      });
    });
  });

  return allMatches;
};

export const initializeBox = (box: BoxProps): BoxExtended => ({
  ...box,
  t: box.y,
  l: box.x,
  b: box.y + box.height,
  r: box.x + box.width,
  tb: box.y + box.height / 2,
  lr: box.x + box.width / 2
});

export const initializeBoxes = (boxes: BoxProps[]) => boxes.map(initializeBox);
