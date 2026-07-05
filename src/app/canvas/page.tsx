'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button'
import theme from '@/theme'

interface Position {
  x: number
  y: number
}

interface PositionData extends Position {
  width: number
  height: number
}

type CornersCoords = number[][]

function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [imageData, setImageData] = useState<ImageData>()
  const [startPoint, setStartPoint] = useState<Position>()
  const [corners, setCorners] = useState<CornersCoords>()
  const [selectionData, setSelectionData] = useState<PositionData>()
  const [drag, setDrag] = useState<boolean>(false)

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

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLElement>) => {
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
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !imageData) return

    if (selectionData) {
      const { x, y } = getCanvasCoordinates(e)
      const corner = corners?.find((coords) => {
        const xCoords = x >= coords[0] - 8 / 2 && x <= coords[0] + 8 / 2
        const yCoords = y >= coords[1] - 8 / 2 && y <= coords[1] + 8 / 2
        if (xCoords && yCoords) {
          return coords
        }
      })

      /*TODO: растягивание выбранной области*/

      console.log({
        cursor: { x, y },
        corners,
        corner,
      })

      return
    }

    setDrag(true)
    setStartPoint(getCanvasCoordinates(e))
  }

  const onMouseUp = () => {
    setDrag(false)
    setStartPoint(undefined)

    const canvas = canvasRef.current
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvas || !imageData || !selectionData) return

    ctx.putImageData(imageData, 0, 0)

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5
    ctx.setLineDash([5, 5])

    ctx.strokeRect(selectionData.x, selectionData.y, selectionData.width, selectionData.height)

    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.rect(selectionData.x, selectionData.y, selectionData.width, selectionData.height)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    ctx.fill('evenodd')

    // Угловые маркеры
    ctx.setLineDash([])
    ctx.fillStyle = '#fff'
    const markerSize = 8
    const corners = [
      [selectionData.x, selectionData.y],
      [selectionData.x + selectionData.width, selectionData.y],
      [selectionData.x, selectionData.y + selectionData.height],
      [selectionData.x + selectionData.width, selectionData.y + selectionData.height],
    ]

    corners.forEach(([mx, my]) => {
      ctx.fillRect(mx - markerSize / 2, my - markerSize / 2, markerSize, markerSize)
    })
    setCorners(corners)
  }

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const canvas = canvasRef.current
    const ctx = canvasRef.current?.getContext('2d')

    if (!startPoint || !drag || !ctx || !canvas || !imageData) return

    const currentPos = getCanvasCoordinates(e)
    const width = currentPos.x - startPoint.x
    const height = currentPos.y - startPoint.y

    ctx.putImageData(imageData, 0, 0)
    ctx.strokeRect(startPoint.x, startPoint.y, width, height)
    ctx.strokeStyle = theme.palette.primary.main
    ctx.lineWidth = 5
    setSelectionData({ x: startPoint.x, y: startPoint.y, width, height })
  }

  const onClick = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob(
      (blob) => {
        if (!blob) return
        const blobUrl = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = blobUrl
        link.download = 'high-res-photo.jpg'

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(blobUrl)
      },
      'image/jpeg',
      1,
    )
  }, [])
  return (
    <>
      <canvas
        id={'test-canvas'}
        ref={canvasRef}
        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      ></canvas>
      <Button onClick={onClick}>click</Button>
    </>
  )
}

export default Page
