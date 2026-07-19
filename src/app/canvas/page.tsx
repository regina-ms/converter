'use client'
import React, { useEffect, useRef, useState } from 'react'
import theme from '@/theme'
import { CANVAS_LINE_WIDTH, CANVAS_MARK_SIZE } from '@/constants'

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

function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [imageData, setImageData] = useState<ImageData>()
  const [startPoint, setStartPoint] = useState<Position>()
  const [corners, setCorners] = useState<CornersCoords>()
  const [selectionData, setSelectionData] = useState<PositionData>()
  const [interaction, setInteraction] = useState<boolean>(false)
  const [activeCorner, setActiveCorner] = useState<[Corner, Position]>()
  const [activeSide, setActiveSide] = useState<Side>()

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
  function namedCorners(rawCorners: number[][]) {
    if (!selectionData) return
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
  function getActiveSide(e: React.MouseEvent<HTMLElement>) {
    if (!corners) return
    const { x, y } = getCanvasCoordinates(e)

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
  function getActiveCorner(e: React.MouseEvent<HTMLElement>) {
    if (!corners) return
    const { x, y } = getCanvasCoordinates(e)
    return (Object.entries(corners) as [Corner, Position][]).find(([cornerName, position]) => {
      return (
        x > position.x - CANVAS_MARK_SIZE &&
        x < position.x + CANVAS_MARK_SIZE &&
        y > position.y - CANVAS_MARK_SIZE &&
        y < position.y + CANVAS_MARK_SIZE
      )
    })
  }
  function setSideCursor(e: React.MouseEvent<HTMLElement>) {
    const activeSide = getActiveSide(e)
    if (!activeSide) {
      return
    }

    if (activeSide[0] === 'top' || activeSide[0] === 'bottom') {
      document.body.style.cursor = 'ns-resize'
    } else {
      document.body.style.cursor = 'ew-resize'
    }
  }
  function setCornerCursor(e: React.MouseEvent<HTMLElement>) {
    const activeCorner = getActiveCorner(e)
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
  function setCursor(e: React.MouseEvent<HTMLElement>) {
    document.body.style.cursor = 'auto'
    setCornerCursor(e)
    setSideCursor(e)
  }
  function getOppositeCorner(currentCorner: [string, Position]) {
    if (!corners) return
    const { x, y } = currentCorner[1]
    return (Object.entries(corners) as [Corner, Position][]).find(([name, position]) => {
      return position.x !== x && position.y !== y
    })
  }

  const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setInteraction(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !imageData) return

    const activeSide = getActiveSide(e)
    const activeCorner = getActiveCorner(e)

    if (!activeSide && !activeCorner) {
      setStartPoint(getCanvasCoordinates(e))
      return
    }

    if (activeCorner) {
      setActiveCorner(activeCorner)
      const oppositeCorner = getOppositeCorner(activeCorner)
      if (oppositeCorner) setStartPoint(oppositeCorner[1])
      return
    }

    if (activeSide) {
      const sideName = activeSide[0]
      setActiveSide(sideName)

      switch (sideName) {
        case 'top':
          setStartPoint(corners?.bottomLeft)
          break
        case 'left':
          setStartPoint(corners?.topRight)
          break
        case 'bottom':
          setStartPoint(corners?.topLeft)
          break
        case 'right':
          setStartPoint(corners?.topLeft)
          break
      }
    }
  }

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!interaction) {
      setCursor(e)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !startPoint || !imageData) return

    const currentPos = getCanvasCoordinates(e)
    const width =
      activeSide === 'top' || activeSide === 'bottom'
        ? Math.abs(selectionData?.width || 0)
        : currentPos.x - startPoint.x
    const height =
      activeSide === 'left' || activeSide === 'right'
        ? Math.abs(selectionData?.height || 0)
        : currentPos.y - startPoint.y

    ctx.putImageData(imageData, 0, 0)
    ctx.strokeRect(startPoint.x, startPoint.y, width, height)
    ctx.strokeStyle = theme.palette.primary.main

    if (activeCorner) {
      ctx.strokeStyle = '#fff'
      ctx.setLineDash([5, 5])
    }

    ctx.lineWidth = CANVAS_LINE_WIDTH
    setSelectionData({ x: startPoint.x, y: startPoint.y, width, height })
  }

  const onMouseUp = () => {
    setInteraction(false)
    setStartPoint(undefined)

    const canvas = canvasRef.current
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvas || !imageData || !selectionData) return

    ctx.putImageData(imageData, 0, 0)
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = CANVAS_LINE_WIDTH
    ctx.setLineDash([5, 5])
    ctx.strokeRect(selectionData.x, selectionData.y, selectionData.width, selectionData.height)

    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.rect(selectionData.x, selectionData.y, selectionData.width, selectionData.height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill('evenodd')

    ctx.setLineDash([])
    ctx.fillStyle = '#fff'

    const rawCorners = [
      [selectionData.x, selectionData.y],
      [selectionData.x + selectionData.width, selectionData.y],
      [selectionData.x, selectionData.y + selectionData.height],
      [selectionData.x + selectionData.width, selectionData.y + selectionData.height],
    ]

    rawCorners.forEach(([x, y]) => {
      ctx.fillRect(x - CANVAS_MARK_SIZE / 2, y - CANVAS_MARK_SIZE / 2, CANVAS_MARK_SIZE, CANVAS_MARK_SIZE)
    })

    setCorners(namedCorners(rawCorners))
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
