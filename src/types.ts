export interface BoxProps {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BoxExtended extends BoxProps {
  top: number;
  left: number;
  bottom: number;
  right: number;
  middleH: number;
  middleV: number;
}

export interface VLine {
  y1: number;
  y2: number;
  x: number;
  elements: [BoxExtended, BoxExtended];
  origin: [string, string];
  showBorder: boolean;
}

export interface HLine {
  x1: number;
  x2: number;
  y: number;
  elements: [BoxExtended, BoxExtended];
  origin: [string, string];
  showBorder: boolean;
}
