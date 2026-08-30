import React, { useEffect, useReducer, useRef, useState } from 'react'
import { CANVAS_LINE_WIDTH, CANVAS_MARK_SIZE, MIN_CROP_SIZE } from '@/constants'
import { Action, Corner, CornersCoords, Position, PositionData, Side, SideActive, State } from '@/cropperTypes'
import theme from '@/theme'

type ImageCropper = {
  staticCanvasRef: React.RefObject<HTMLCanvasElement>
  dynamicCanvasRef: React.RefObject<HTMLCanvasElement>
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void
  updateImage: (setInitial?: boolean) => void
  imageSrc: string
}

type Metrics = {
  markerSize: number
  lineWidth: number
}

function getActiveSide(currentPosition: Position, corners: CornersCoords, metrics: Metrics) {
  const { x, y } = currentPosition
  const { markerSize, lineWidth } = metrics

  const sides: SideActive = {
    left:
      x > corners.topLeft.x - lineWidth &&
      x < corners.topLeft.x + lineWidth &&
      y > corners.topLeft.y + markerSize &&
      y < corners.bottomLeft.y - markerSize,
    right:
      x > corners.topRight.x - lineWidth &&
      x < corners.topRight.x + lineWidth &&
      y > corners.topRight.y + markerSize &&
      y < corners.bottomRight.y - markerSize,
    top:
      x > corners.topLeft.x + markerSize &&
      x < corners.topRight.x - markerSize &&
      y > corners.topLeft.y - lineWidth &&
      y < corners.topLeft.y + lineWidth,
    bottom:
      x > corners.bottomLeft.x + markerSize &&
      x < corners.bottomRight.x - markerSize &&
      y > corners.bottomLeft.y - lineWidth &&
      y < corners.bottomLeft.y + lineWidth,
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
function getActiveCorner(currentPosition: Position, corners: CornersCoords, markerSize: number) {
  const { x, y } = currentPosition
  return (Object.entries(corners) as [Corner, Position][]).find(([cornerName, position]) => {
    return (
      x > position.x - markerSize &&
      x < position.x + markerSize &&
      y > position.y - markerSize &&
      y < position.y + markerSize
    )
  })
}
function setSideCursor(currentPosition: Position, corners: CornersCoords, metrics: Metrics) {
  const activeSide = getActiveSide(currentPosition, corners, metrics)
  if (!activeSide) {
    return
  }

  if (activeSide[0] === 'top' || activeSide[0] === 'bottom') {
    document.body.style.cursor = 'ns-resize'
  } else {
    document.body.style.cursor = 'ew-resize'
  }
}
function setCornerCursor(currentPosition: Position, corners: CornersCoords, markerSize: number) {
  const activeCorner = getActiveCorner(currentPosition, corners, markerSize)
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
function setCursor(currentPosition: Position, corners: CornersCoords, metrics: Metrics) {
  document.body.style.cursor = 'auto'
  setCornerCursor(currentPosition, corners, metrics.markerSize)
  setSideCursor(currentPosition, corners, metrics)
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
function getCanvasCoordinates(e: React.PointerEvent<HTMLCanvasElement>) {
  const canvas = e.currentTarget

  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height

  const raw = {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  }

  return {
    x: Math.min(canvas.width, Math.max(0, raw.x)),
    y: Math.min(canvas.height, Math.max(0, raw.y)),
  }
}
function getCanvasObjectSize(canvas: HTMLCanvasElement, value: number) {
  const rect = canvas.getBoundingClientRect()
  return value * (canvas.width / rect.width)
}

function interaction(state: State, action: Action): State {
  let width = state.selectionData?.width
  let height = state.selectionData?.height

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
        if (action.payload.side === 'left')
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
    case 'INTERACTION_MOVE':
      if (state.phase.name === 'idle') {
        return state
      }

      width = action.payload.currentPosition.x - state.phase.startPosition.x
      height = action.payload.currentPosition.y - state.phase.startPosition.y

      if (state.phase.name === 'stretchingSide') {
        if (state.phase.side === 'top' || state.phase.side === 'bottom') {
          width = state.selectionData?.width || 0
        }
        if (state.phase.side === 'left' || state.phase.side === 'right') {
          height = state.selectionData?.height || 0
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
      let selectionData: PositionData = action.payload.selectionData

      const rawCorners = [
        [selectionData.x, selectionData.y],
        [selectionData.x + selectionData.width, selectionData.y],
        [selectionData.x, selectionData.y + selectionData.height],
        [selectionData.x + selectionData.width, selectionData.y + selectionData.height],
      ]

      let { x, y } = selectionData

      if (selectionData.height < 0) {
        y = selectionData.y + selectionData.height
      }

      if (selectionData.width < 0) {
        x = selectionData.x + selectionData.width
      }

      return {
        ...state,
        phase: {
          name: 'idle',
          cornersCoords: namedCorners(rawCorners, selectionData),
        },
        selectionData: {
          width: Math.abs(selectionData.width),
          height: Math.abs(selectionData.height),
          y,
          x,
        },
      }
    case 'CROP':
      return {
        ...state,
        phase: {
          name: 'idle',
        },
        selectionData: undefined,
      }
    default:
      return state
  }
}

/* TODO:
    * функции для кнопок Вернуть и Обрезать должны появляться только при определенных обстоятельствах, они не должны быть доступны всегда
    * разобраться с URL.revokeObjectURL и requestAnimationFrame
    * */


export function useImageCropper(initialImageSrc: string): ImageCropper {
  const dynamicCanvasRef = useRef<HTMLCanvasElement>(null)
  const staticCanvasRef = useRef<HTMLCanvasElement>(null)
  const [state, dispatch] = useReducer(interaction, { phase: { name: 'idle' } })
  const [imageSrc, setImageSrc] = useState<string>(initialImageSrc)
  const [metrics, setMetrics] = useState<Metrics>({ markerSize: 0, lineWidth: 0 })

  function updateImage(setInitial?: boolean) {
    const staticCanvas = staticCanvasRef.current
    const dynamicCanvas = dynamicCanvasRef.current
    const staticCtx = staticCanvas?.getContext('2d')

    if (!staticCtx || !staticCanvas || !dynamicCanvas) return

    const image = new Image()
    image.src = setInitial ? initialImageSrc : imageSrc

    image.onload = () => {
      staticCanvas.width = state.selectionData?.width || image.naturalWidth
      staticCanvas.height = state.selectionData?.height || image.naturalHeight

      dynamicCanvas.width = state.selectionData?.width || image.naturalWidth
      dynamicCanvas.height = state.selectionData?.height || image.naturalHeight

      if (state.selectionData) {
        staticCtx.drawImage(
          image,
          state.selectionData.x,
          state.selectionData.y,
          state.selectionData.width,
          state.selectionData.height,
          0,
          0,
          state.selectionData.width,
          state.selectionData.height,
        )
      } else {
        staticCtx.drawImage(image, 0, 0)
      }

      setMetrics((prev) => {
        if (!dynamicCanvasRef.current) {
          return prev
        }
        return {
          markerSize: getCanvasObjectSize(dynamicCanvasRef.current, CANVAS_MARK_SIZE),
          lineWidth: getCanvasObjectSize(dynamicCanvasRef.current, CANVAS_LINE_WIDTH),
        }
      })

      staticCanvas.toBlob((blob) => {
        if (!blob) return
        setImageSrc(URL.createObjectURL(blob))
      })
      dispatch({ type: 'CROP' })
    }
  }

  useEffect(() => {
    updateImage(true)
  }, [])

  useEffect(() => {
    const canvas = dynamicCanvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = metrics.lineWidth

    if (state.phase.name !== 'idle' && state.selectionData) {
      ctx.strokeStyle = state.phase.name === 'drawing' ? theme.palette.primary.main : '#fff'
      if (state.phase.name === 'drawing')
        ctx.setLineDash([getCanvasObjectSize(canvas, 5), getCanvasObjectSize(canvas, 5)])

      ctx.strokeRect(
        state.phase.startPosition.x,
        state.phase.startPosition.y,
        state.selectionData.width,
        state.selectionData.height,
      )
      return
    }

    if (state.phase.name === 'idle' && state.selectionData && state.phase.cornersCoords) {
      ctx.strokeStyle = '#fff'
      ctx.setLineDash([getCanvasObjectSize(canvas, 5), getCanvasObjectSize(canvas, 5)])
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
          position.x - metrics.markerSize / 2,
          position.y - metrics.markerSize / 2,
          metrics.markerSize,
          metrics.markerSize,
        )
      })
    }
  }, [state])

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const currentPosition = getCanvasCoordinates(e)

    if ('cornersCoords' in state.phase && state.phase.cornersCoords) {
      const activeSide = getActiveSide(currentPosition, state.phase.cornersCoords, metrics)
      const activeCorner = getActiveCorner(currentPosition, state.phase.cornersCoords, metrics.markerSize)

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

    dispatch({ type: 'DRAW_START', payload: { startPosition: currentPosition } })
  }

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const currentPosition = getCanvasCoordinates(e)

    if (state.phase.name === 'idle' && state.phase.cornersCoords) {
      setCursor(currentPosition, state.phase.cornersCoords, metrics)
      return
    }

    dispatch({
      type: 'INTERACTION_MOVE',
      payload: { currentPosition },
    })
  }

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const x = state.selectionData?.x || getCanvasCoordinates(e).x
    const y = state.selectionData?.y || getCanvasCoordinates(e).y

    const width = state.selectionData?.width || getCanvasObjectSize(canvas, MIN_CROP_SIZE)
    const height = state.selectionData?.height || getCanvasObjectSize(canvas, MIN_CROP_SIZE)

    const directionX = x + width > canvas.width ? -1 : 1
    const directionY = y + height > canvas.height ? -1 : 1

    dispatch({
      type: 'INTERACTION_END',
      payload: {
        selectionData: {
          width: width * directionX,
          height: height * directionY,
          x,
          y,
        },
      },
    })
  }

  return {
    dynamicCanvasRef,
    staticCanvasRef,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    updateImage,
    imageSrc,
  }
}
