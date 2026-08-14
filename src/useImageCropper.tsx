import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CANVAS_LINE_WIDTH, CANVAS_MARK_SIZE } from '@/constants'
import { Action, Corner, CornersCoords, Position, PositionData, Side, SideActive, State } from '@/cropperTypes'
import theme from '@/theme'

type ImageCropper = {
  staticCanvasRef: React.RefObject<HTMLCanvasElement>
  dynamicCanvasRef: React.RefObject<HTMLCanvasElement>
  onMouseDown: (e: React.MouseEvent<HTMLElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  crop?: () => void
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

function reducer(state: State, action: Action): State {
  let width: number
  let height: number

  switch (action.type) {
    case 'SIDE_STRETCH_START':
      if (state.phase.name !== 'idle' || !state.phase.cornersCoords) return state

      width = state.phase.cornersCoords.topRight.x - state.phase.cornersCoords.topLeft.x
      height = state.phase.cornersCoords.bottomLeft.y - state.phase.cornersCoords.topLeft.y
      if (action.payload.side === 'top' || action.payload.side === 'bottom') {
        height =
          (action.payload.side === 'top'
            ? state.phase.cornersCoords.topLeft.y
            : state.phase.cornersCoords.bottomLeft.y) - action.payload.startPosition.y
      } else {
        width =
          (action.payload.side === 'left'
            ? state.phase.cornersCoords.topLeft.x
            : state.phase.cornersCoords.topRight.x) - action.payload.startPosition.x
      }
      return {
        ...state,
        phase: {
          name: 'stretchingSide',
          side: action.payload.side,
          startPosition: action.payload.startPosition,
          cornersCoords: state.phase.cornersCoords,
        },
        selectionData: {
          x: action.payload.startPosition.x,
          y: action.payload.startPosition.y,
          width,
          height,
        },
      }
    case 'CORNER_STRETCH_START':
      if (state.phase.name !== 'idle' || !state.phase.cornersCoords) return state
      const cornerPos = state.phase.cornersCoords[action.payload.corner]
      return {
        ...state,
        phase: {
          name: 'stretchingCorner',
          corner: action.payload.corner,
          startPosition: action.payload.startPosition,
          cornersCoords: state.phase.cornersCoords,
        },
        selectionData: {
          x: action.payload.startPosition.x,
          y: action.payload.startPosition.y,
          width: cornerPos.x - action.payload.startPosition.x,
          height: cornerPos.y - action.payload.startPosition.y,
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
        selectionData: undefined,
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

export function useImageCropper(initialImageSrc: string): ImageCropper {
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null)
  const staticCanvasRef = useRef<HTMLCanvasElement>(null)
  const [state, dispatch] = useReducer(reducer, { phase: { name: 'idle' } })
  const [image, setImage] = useState<HTMLImageElement>()

  /** TODO: Исправить баг из-за которого неправильно вырезается часть из уже вырезанной части (дело в useState image) */
  function crop() {
    if (!state.selectionData) return
    const { x, y, height, width } = state.selectionData

    const staticCanvas = staticCanvasRef.current
    const dynamicCanvas = dynamicCanvasRef.current
    const staticCtx = staticCanvas?.getContext('2d')
    const dynamicCtx = dynamicCanvasRef.current?.getContext('2d')

    if (!staticCtx || !image || !dynamicCtx || !staticCanvas || !dynamicCanvas) return

    staticCtx.clearRect(0, 0, image.naturalWidth, image.naturalHeight)
    dynamicCtx.clearRect(0, 0, image.naturalWidth, image.naturalHeight)

    staticCanvas.width = width
    staticCanvas.height = height
    dynamicCanvas.width = width
    dynamicCanvas.height = height

    staticCtx.drawImage(image, x, y, width, height, 0, 0, width, height)
  }

  useEffect(() => {
    const staticCanvas = staticCanvasRef.current
    const ctx = staticCanvasRef.current?.getContext('2d')
    const dynamicCanvas = dynamicCanvasRef.current
    if (!ctx || !staticCanvas || !dynamicCanvas) return

    const img = new Image()
    img.src = initialImageSrc
    setImage(img)

    img.onload = () => {
      staticCanvas.width = img.naturalWidth
      staticCanvas.height = img.naturalHeight

      dynamicCanvas.width = img.naturalWidth
      dynamicCanvas.height = img.naturalHeight
      ctx.drawImage(img, 0, 0)
    }
  }, [])

  useEffect(() => {
    const canvas = dynamicCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    if (state.phase.name !== 'idle' && state.selectionData) {
      ctx.strokeStyle = state.phase.name === 'drawing' ? theme.palette.primary.main : '#fff'
      if (state.phase.name === 'drawing') ctx.setLineDash([5, 5])

      ctx.lineWidth = CANVAS_LINE_WIDTH
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeRect(
        state.phase.startPosition.x,
        state.phase.startPosition.y,
        state.selectionData.width,
        state.selectionData.height,
      )
      return
    }

    if (state.phase.name === 'idle' && state.selectionData && state.phase.cornersCoords) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
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
    const canvas = dynamicCanvasRef.current

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

    if (state.phase.name !== 'idle') return
    if (!state.phase.cornersCoords) {
      dispatch({ type: 'DRAW_START', payload: { startPosition: currentPosition } })
      return
    }

    const activeSide = getActiveSide(currentPosition, state.phase.cornersCoords)
    const activeCorner = getActiveCorner(currentPosition, state.phase.cornersCoords)

    if (!activeCorner && !activeSide) {
      dispatch({ type: 'DRAW_START', payload: { startPosition: currentPosition } })
      return
    }

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
  }

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const currentPosition = getCanvasCoordinates(e)
    if (state.phase.name === 'idle' && state.phase.cornersCoords !== undefined) {
      setCursor(currentPosition, state.phase.cornersCoords)
    }

    dispatch({ type: 'MOUSE_MOVE', payload: { currentPosition } })
  }

  const onMouseUp = () => {
    const canvas = dynamicCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    dispatch({ type: 'INTERACTION_END' })
  }

  const onMouseLeave = () => (document.body.style.cursor = 'auto')

  return { dynamicCanvasRef, staticCanvasRef, onMouseDown, onMouseLeave, onMouseMove, onMouseUp, crop }
}
