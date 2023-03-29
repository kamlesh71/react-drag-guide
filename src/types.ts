export interface BoxProps {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EdgeMatched {
  dragginBox: BoxExtended;
  box: BoxExtended;
  dragginBoxEgde: Edges;
  boxEdge: Edges;
}

export interface BoxExtended extends BoxProps {
  t: number;
  l: number;
  b: number;
  r: number;
  lr: number;
  tb: number;
}

export type Edges = keyof Pick<
  BoxExtended,
  'l' | 'r' | 'lr' | 't' | 'tb' | 'b'
>;

export interface VLine {
  y1: number;
  y2: number;
  x: number;
}

export interface HLine {
  x1: number;
  x2: number;
  y: number;
}
