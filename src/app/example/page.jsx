'use client'
import React, { useRef, useState, useCallback, useEffect } from 'react'

function CanvasCropper() {
  // Refs
  const fileInputRef = useRef(null)
  const sourceCanvasRef = useRef(null) // Canvas с исходным изображением
  const resultCanvasRef = useRef(null) // Canvas с результатом
  const containerRef = useRef(null) // Контейнер для координат мыши

  // State
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [crop, setCrop] = useState(null) // { x, y, width, height } в координатах canvas
  const [startPoint, setStartPoint] = useState(null)
  const [aspectRatio, setAspectRatio] = useState(null) // например, 1 для квадрата, 16/9 и т.д.

  // Загрузка изображения
  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        const canvas = sourceCanvasRef.current
        const ctx = canvas.getContext('2d')

        // Устанавливаем размер canvas под изображение (с ограничением по ширине)
        const maxWidth = 800
        const scale = img.width > maxWidth ? maxWidth / img.width : 1
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setImageLoaded(true)
        setCrop(null)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  }

  // Получаем координаты мыши относительно canvas
  const getMousePos = useCallback((e) => {
    const canvas = sourceCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }, [])

  // Начало выделения
  const handleMouseDown = (e) => {
    if (!imageLoaded) return
    const pos = getMousePos(e)
    setStartPoint(pos)
    setIsDragging(true)
    setCrop({ x: pos.x, y: pos.y, width: 0, height: 0 })
  }

  // Перемещение мыши — рисуем рамку выделения
  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !startPoint) return

      const pos = getMousePos(e)
      let width = pos.x - startPoint.x
      let height = pos.y - startPoint.y

      // Применяем фиксированное соотношение сторон, если задано
      if (aspectRatio) {
        const absWidth = Math.abs(width)
        height = ((width > 0 ? 1 : -1) * absWidth) / aspectRatio
      }

      setCrop({
        x: width < 0 ? pos.x : startPoint.x,
        y: height < 0 ? pos.y : startPoint.y,
        width: Math.abs(width),
        height: Math.abs(height),
      })
    },
    [isDragging, startPoint, aspectRatio, getMousePos],
  )

  // Завершение выделения
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setStartPoint(null)
  }, [])

  // Рисуем рамку выделения поверх изображения
  useEffect(() => {
    if (!imageLoaded) return

    const canvas = sourceCanvasRef.current
    const ctx = canvas.getContext('2d')

    // Перерисовываем изображение (чтобы стереть старую рамку)
    // В реальном приложении лучше хранить исходное изображение отдельно
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Рисуем рамку выделения
      if (crop && crop.width > 5 && crop.height > 5) {
        ctx.strokeStyle = '#fff'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(crop.x, crop.y, crop.width, crop.height)

        // Затемнение области вне выделения
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        ctx.beginPath()
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.rect(crop.x, crop.y, crop.width, crop.height)
        ctx.fill('evenodd')

        // Угловые маркеры
        ctx.setLineDash([])
        ctx.fillStyle = '#fff'
        const markerSize = 8
        ;[
          [crop.x, crop.y],
          [crop.x + crop.width, crop.y],
          [crop.x, crop.y + crop.height],
          [crop.x + crop.width, crop.y + crop.height],
        ].forEach(([mx, my]) => {
          ctx.fillRect(mx - markerSize / 2, my - markerSize / 2, markerSize, markerSize)
        })
      }
    }
    // Восстанавливаем из dataURL (в продакшене храните Image объект)
    img.src = canvas.toDataURL()
  }, [crop, imageLoaded])

  // Обрезка изображения
  const performCrop = () => {
    if (!crop || crop.width < 10 || crop.height < 10) return

    const sourceCanvas = sourceCanvasRef.current
    const resultCanvas = resultCanvasRef.current
    const resultCtx = resultCanvas.getContext('2d')

    // Устанавливаем размер результата
    resultCanvas.width = crop.width
    resultCanvas.height = crop.height

    // Копируем выделенную область
    resultCtx.drawImage(
      sourceCanvas,
      crop.x,
      crop.y,
      crop.width,
      crop.height, // Исходная область
      0,
      0,
      crop.width,
      crop.height, // Целевая область
    )
  }

  // Скачивание результата
  const downloadResult = () => {
    const resultCanvas = resultCanvasRef.current
    const link = document.createElement('a')
    link.download = 'cropped-image.png'
    link.href = resultCanvas.toDataURL('image/png')
    link.click()
  }

  // Глобальные обработчики для отпускания мыши
  useEffect(() => {
    const handleGlobalMouseUp = () => handleMouseUp()
    const handleGlobalMouseMove = (e) => handleMouseMove(e)

    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp)
      window.addEventListener('mousemove', handleGlobalMouseMove)
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp)
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [isDragging, handleMouseUp, handleMouseMove])

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Canvas Image Cropper</h2>

      {/* Загрузка файла */}
      <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileSelect} />

      {/* Настройки */}
      {imageLoaded && (
        <div style={{ margin: '10px 0' }}>
          <label>Соотношение сторон: </label>
          <select
            value={aspectRatio || 'free'}
            onChange={(e) => {
              const val = e.target.value
              setAspectRatio(val === 'free' ? null : parseFloat(val))
            }}
          >
            <option value='free'>Свободное</option>
            <option value='1'>1:1 (Квадрат)</option>
            <option value='1.777'>16:9</option>
            <option value='1.333'>4:3</option>
            <option value='0.666'>2:3</option>
          </select>
        </div>
      )}

      {/* Canvas с изображением */}
      <div ref={containerRef} style={{ marginTop: 20 }}>
        <canvas
          ref={sourceCanvasRef}
          onMouseDown={handleMouseDown}
          style={{
            border: '1px solid #ccc',
            cursor: isDragging ? 'crosshair' : 'default',
            maxWidth: '100%',
          }}
        />
      </div>

      {/* Кнопки действий */}
      {crop && crop.width > 10 && (
        <div style={{ marginTop: 10 }}>
          <button onClick={performCrop}>Обрезать</button>
          <button onClick={() => setCrop(null)} style={{ marginLeft: 10 }}>
            Сбросить выделение
          </button>
        </div>
      )}

      {/* Результат */}
      <div style={{ marginTop: 20 }}>
        <h3>Результат:</h3>
        <canvas ref={resultCanvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
        {resultCanvasRef.current?.width > 0 && (
          <div style={{ marginTop: 10 }}>
            <button onClick={downloadResult}>Скачать</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CanvasCropper
