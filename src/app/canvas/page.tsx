'use client'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CANVAS_LINE_WIDTH, CANVAS_MARK_SIZE } from '@/constants'
import theme from '@/theme'

interface Position {
  x: number
  y: number
}

interface PositionData extends Position {
  width: number
  height: number
}

type Side = 'top' | 'bottom' | 'left' | 'right'
type SideActive = {
  [key in Side]: boolean
}

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
type CornersCoords = {
  [key in Corner]: Position
}

type Phase =
  | { name: 'idle'; cornersCoords?: CornersCoords }
  | { name: 'drawing'; startPosition: Position }
  | { name: 'stretchingCorner'; corner: Corner; startPosition: Position; cornersCoords: CornersCoords }
  | { name: 'stretchingSide'; side: Side; startPosition: Position; cornersCoords: CornersCoords }

interface State {
  phase: Phase
  selectionData?: PositionData
}

type Action =
  | { type: 'DRAW_START'; payload: { startPosition: Position } }
  | { type: 'CORNER_STRETCH_START'; payload: { corner: Corner; startPosition: Position } }
  | { type: 'SIDE_STRETCH_START'; payload: { side: Side; startPosition: Position } }
  | {
      type: 'MOUSE_MOVE'
      payload: {
        currentPosition: Position
      }
    }
  | {
      type: 'INTERACTION_END'
      payload: { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }
    }

function reducer(state: State, action: Action): State {
  let width: number
  let height: number

  switch (action.type) {
    case 'SIDE_STRETCH_START':
      if (state.phase.name !== 'idle' || !state.phase.cornersCoords) return state
      return {
        ...state,
        phase: {
          name: 'stretchingSide',
          side: action.payload.side,
          startPosition: action.payload.startPosition,
          cornersCoords: state.phase.cornersCoords,
        },
      }
    case 'CORNER_STRETCH_START':
      if (state.phase.name !== 'idle' || !state.phase.cornersCoords) return state
      return {
        ...state,
        phase: {
          name: 'stretchingCorner',
          corner: action.payload.corner,
          startPosition: action.payload.startPosition,
          cornersCoords: state.phase.cornersCoords,
        },
      }
    case 'MOUSE_MOVE':
      if (state.phase.name === 'idle') {
        return state
      }

      width = action.payload.currentPosition.x - state.phase.startPosition.x
      height = action.payload.currentPosition.y - state.phase.startPosition.y

      if (state.phase.name === 'stretchingSide') {
        if (state.phase.side === 'top' || state.phase.side === 'bottom') {
          width = Math.abs(state.selectionData?.width || 0)
        }
        if (state.phase.side === 'left' || state.phase.side === 'right') {
          height = Math.abs(state.selectionData?.height || 0)
        }
      }

      return {
        ...state,
        selectionData: { x: state.phase.startPosition.x, y: state.phase.startPosition.y, width, height },
      }
    case 'DRAW_START':
      return {
        ...state,
        phase: {
          name: 'drawing',
          startPosition: action.payload.startPosition,
        },
      }
    case 'INTERACTION_END':
      if (!state.selectionData) return state
      const rawCorners = [
        [state.selectionData.x, state.selectionData.y],
        [state.selectionData.x + state.selectionData.width, state.selectionData.y],
        [state.selectionData.x, state.selectionData.y + state.selectionData.height],
        [state.selectionData.x + state.selectionData.width, state.selectionData.y + state.selectionData.height],
      ]

      return {
        ...state,
        phase: {
          name: 'idle',
          cornersCoords: namedCorners(rawCorners, state.selectionData),
        },
      }

    default:
      return state
  }
}

function getActiveSide(currentPosition: Position, corners: CornersCoords) {
  const { x, y } = currentPosition

  const sides: SideActive = {
    left:
      x > corners.topLeft.x - CANVAS_LINE_WIDTH &&
      x < corners.topLeft.x + CANVAS_LINE_WIDTH &&
      y > corners.topLeft.y + CANVAS_MARK_SIZE &&
      y < corners.bottomLeft.y - CANVAS_MARK_SIZE,
    right:
      x > corners.topRight.x - CANVAS_LINE_WIDTH &&
      x < corners.topRight.x + CANVAS_LINE_WIDTH &&
      y > corners.topRight.y + CANVAS_MARK_SIZE &&
      y < corners.bottomRight.y - CANVAS_MARK_SIZE,
    top:
      x > corners.topLeft.x + CANVAS_MARK_SIZE &&
      x < corners.topRight.x - CANVAS_MARK_SIZE &&
      y > corners.topLeft.y - CANVAS_LINE_WIDTH &&
      y < corners.topLeft.y + CANVAS_LINE_WIDTH,
    bottom:
      x > corners.bottomLeft.x + CANVAS_MARK_SIZE &&
      x < corners.bottomRight.x - CANVAS_MARK_SIZE &&
      y > corners.bottomLeft.y - CANVAS_LINE_WIDTH &&
      y < corners.bottomLeft.y + CANVAS_LINE_WIDTH,
  }

  return (Object.entries(sides) as [Side, boolean][]).find(([name, isActive]) => isActive)
}
function getStartPosition(side: Side, corners: CornersCoords): Position {
  switch (side) {
    case 'top':
      return corners.bottomLeft
    case 'left':
      return corners.topRight
    case 'bottom':
      return corners.topLeft
    case 'right':
      return corners.topLeft
  }
}
function getActiveCorner(currentPosition: Position, corners: CornersCoords) {
  const { x, y } = currentPosition
  return (Object.entries(corners) as [Corner, Position][]).find(([cornerName, position]) => {
    return (
      x > position.x - CANVAS_MARK_SIZE &&
      x < position.x + CANVAS_MARK_SIZE &&
      y > position.y - CANVAS_MARK_SIZE &&
      y < position.y + CANVAS_MARK_SIZE
    )
  })
}
function setSideCursor(currentPosition: Position, corners: CornersCoords) {
  const activeSide = getActiveSide(currentPosition, corners)
  if (!activeSide) {
    return
  }

  if (activeSide[0] === 'top' || activeSide[0] === 'bottom') {
    document.body.style.cursor = 'ns-resize'
  } else {
    document.body.style.cursor = 'ew-resize'
  }
}
function setCornerCursor(currentPosition: Position, corners: CornersCoords) {
  const activeCorner = getActiveCorner(currentPosition, corners)
  if (!activeCorner) return

  switch (activeCorner[0]) {
    case 'topLeft':
      document.body.style.cursor = 'nwse-resize'
      break
    case 'topRight':
      document.body.style.cursor = 'nesw-resize'
      break
    case 'bottomLeft':
      document.body.style.cursor = 'nesw-resize'
      break
    case 'bottomRight':
      document.body.style.cursor = 'nwse-resize'
      break
  }
}
function setCursor(currentPosition: Position, corners: CornersCoords) {
  document.body.style.cursor = 'auto'
  setCornerCursor(currentPosition, corners)
  setSideCursor(currentPosition, corners)
}
function getOppositeCornerPosition(currentCorner: [string, Position], corners: CornersCoords) {
  const { x, y } = currentCorner[1]
  return (Object.values(corners) as Position[]).find((position) => {
    return position.x !== x && position.y !== y
  })
}
function namedCorners(rawCorners: number[][], selectionData: PositionData) {
  const xValues = rawCorners.map(([x, y]) => x)
  const yValues = rawCorners.map(([x, y]) => y)
  const topLeft = { x: Math.min(...xValues), y: Math.min(...yValues) }
  return {
    topLeft,
    topRight: {
      x: topLeft.x + Math.abs(selectionData.width),
      y: topLeft.y,
    },
    bottomLeft: {
      x: topLeft.x,
      y: topLeft.y + Math.abs(selectionData.height),
    },
    bottomRight: {
      x: topLeft.x + Math.abs(selectionData.width),
      y: topLeft.y + Math.abs(selectionData.height),
    },
  }
}

function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageData, setImageData] = useState<ImageData>()
  const [state, dispatch] = useReducer(reducer, { phase: { name: 'idle' } })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvas) return

    const img = new Image()
    img.src = '/test-vert.jpg'

    img.onload = () => {
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
      setImageData(ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight))
    }
  }, [])

  useEffect(() => {
    /** TODO: убрать мигание прямоугольника при растягивании*/
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !imageData) return

    if (state.phase.name !== 'idle' && state.selectionData) {
      ctx.strokeStyle = state.phase.name === 'drawing' ? theme.palette.primary.main : '#fff'
      if (state.phase.name === 'drawing') ctx.setLineDash([5, 5])

      ctx.lineWidth = CANVAS_LINE_WIDTH
      ctx.putImageData(imageData, 0, 0)
      ctx.strokeRect(
        state.phase.startPosition.x,
        state.phase.startPosition.y,
        state.selectionData.width,
        state.selectionData.height,
      )

      return
    }

    if (state.phase.name === 'idle' && state.selectionData && state.phase.cornersCoords) {
      ctx.putImageData(imageData, 0, 0)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = CANVAS_LINE_WIDTH
      ctx.setLineDash([5, 5])
      ctx.strokeRect(
        state.selectionData.x,
        state.selectionData.y,
        state.selectionData.width,
        state.selectionData.height,
      )

      ctx.beginPath()
      ctx.rect(0, 0, canvas.width, canvas.height)
      ctx.rect(state.selectionData.x, state.selectionData.y, state.selectionData.width, state.selectionData.height)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      ctx.fill('evenodd')

      ctx.setLineDash([])
      ctx.fillStyle = '#fff'

      Object.values(state.phase.cornersCoords).forEach((position) => {
        ctx.fillRect(
          position.x - CANVAS_MARK_SIZE / 2,
          position.y - CANVAS_MARK_SIZE / 2,
          CANVAS_MARK_SIZE,
          CANVAS_MARK_SIZE,
        )
      })
    }
  }, [state])

  function getCanvasCoordinates(e: React.MouseEvent<HTMLElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const currentPosition = getCanvasCoordinates(e)
    if (!('cornersCoords' in state.phase) || !state.phase.cornersCoords) {
      dispatch({ type: 'DRAW_START', payload: { startPosition: currentPosition } })
      return
    }

    const activeSide = getActiveSide(currentPosition, state.phase.cornersCoords)
    const activeCorner = getActiveCorner(currentPosition, state.phase.cornersCoords)

    if (activeSide) {
      const [side] = activeSide
      const startPosition = getStartPosition(side, state.phase.cornersCoords)
      dispatch({ type: 'SIDE_STRETCH_START', payload: { side, startPosition } })
      return
    }

    if (activeCorner) {
      const [corner] = activeCorner
      const oppositeCorner = getOppositeCornerPosition(activeCorner, state.phase.cornersCoords)
      if (!oppositeCorner) return
      dispatch({
        type: 'CORNER_STRETCH_START',
        payload: { corner, startPosition: oppositeCorner },
      })
      return
    }

    dispatch({ type: 'DRAW_START', payload: { startPosition: currentPosition } })
  }

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const currentPosition = getCanvasCoordinates(e)
    if (state.phase.name === 'idle' && state.phase.cornersCoords !== undefined) {
      setCursor(currentPosition, state.phase.cornersCoords)
    }

    dispatch({ type: 'MOUSE_MOVE', payload: { currentPosition } })
  }

  const onMouseUp = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !imageData) return
    dispatch({ type: 'INTERACTION_END', payload: { canvas, ctx, imageData } })
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      ></canvas>
    </>
  )
}

export default Page
