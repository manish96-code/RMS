import React, { useState, useRef, useEffect } from 'react'

/**
 * ResizableDrawer Component
 * A full-height right-side slide-over modal drawer that can be dynamically resized
 * by dragging the left border handle.
 */
const ResizableDrawer = ({
  children,
  onClose,
  initialWidth = 480,
  minWidth = 360,
  maxWidth = 1100,
  storageKey = 'drawer_width',
}) => {
  const [width, setWidth] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) return parseInt(saved, 10)
    } catch (e) {
      // fallback
    }
    return initialWidth
  })

  const isResizingRef = useRef(false)

  const startResizing = (e) => {
    e.preventDefault()
    isResizingRef.current = true
    document.body.style.cursor = 'ew-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (moveEvent) => {
      if (!isResizingRef.current) return
      const newWidth = window.innerWidth - moveEvent.clientX
      const maxAllowedWidth = Math.min(maxWidth, window.innerWidth - 40)
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxAllowedWidth)
      setWidth(clampedWidth)
      try {
        localStorage.setItem(storageKey, clampedWidth.toString())
      } catch (err) {
        // fallback
      }
    }

    const handleMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex justify-end">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Resizable Drawer Panel */}
      <div
        className="relative bg-white h-full border-l border-slate-200 shadow-2xl flex flex-col justify-between text-left z-10 transition-none"
        style={{ width: `${width}px`, maxWidth: '100vw' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle on Left Border */}
        <div
          onMouseDown={startResizing}
          className="absolute -left-3 top-0 bottom-0 w-6 cursor-ew-resize hover:bg-emerald-500/10 active:bg-emerald-500/20 group z-30 flex items-center justify-center transition-colors select-none"
          title="Drag left or right to resize modal"
        >
          {/* Grab Bar Indicator */}
          <div className="w-2 h-16 bg-slate-300 group-hover:bg-emerald-600 active:bg-emerald-700 rounded-full shadow-md flex flex-col items-center justify-center gap-1 transition-all group-hover:scale-110">
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
            <span className="w-1 h-1 bg-white rounded-full"></span>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}

export default ResizableDrawer
