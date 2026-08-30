export interface Position {
  x: number
  y: number
}

export interface PositionData extends Position {
  width: number
  height: number
}

export type Side = 'top' | 'bottom' | 'left' | 'right'

export type SideActive = { [key in Side]: boolean }

export type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'

export type CornersCoords = { [key in Corner]: Position }

export type Phase =
  | { name: 'idle'; cornersCoords?: CornersCoords }
  | { name: 'drawing'; startPosition: Position }
  | { name: 'stretchingCorner'; corner: Corner; startPosition: Position; cornersCoords: CornersCoords }
  | { name: 'stretchingSide'; side: Side; startPosition: Position; cornersCoords: CornersCoords }

export interface State {
  phase: Phase
  selectionData?: PositionData
}

export type Action =
  | { type: 'DRAW_START'; payload: { startPosition: Position } }
  | { type: 'CORNER_STRETCH_START'; payload: { corner: Corner; startPosition: Position } }
  | { type: 'SIDE_STRETCH_START'; payload: { side: Side; startPosition: Position } }
  | { type: 'INTERACTION_MOVE'; payload: { currentPosition: Position } }
  | { type: 'INTERACTION_END'; payload: { selectionData: PositionData } }
  | { type: 'CROP' }
