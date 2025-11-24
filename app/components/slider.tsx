"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedSliderProps {
  label: string
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  className?: string
}

export function AnimatedSlider({
  label,
  value: controlledValue,
  defaultValue = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  className,
}: AnimatedSliderProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const [isDragging, setIsDragging] = React.useState(false)
  const [isClick, setIsClick] = React.useState(false)
  const [stretchDirection, setStretchDirection] = React.useState<'left' | 'right'>('left')
  const trackRef = React.useRef<HTMLDivElement>(null)
  const pointerDownPos = React.useRef(0)

  const value = controlledValue ?? internalValue

  const stretchRaw = useMotionValue(0)
  const stretch = useSpring(stretchRaw, { 
    stiffness: 250,
    damping: 40,
    mass: 4.5,
  })
  
  const scaleX = useTransform(stretch, [-3, 0, 3], [1.06, 1, 1.06])

  const handlePointerMove = (clientX: number, isInitialClick = false) => {
    if (!trackRef.current) return

    const rect = trackRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = (x / rect.width) * 100

    const clampedPercentage = Math.max(0, Math.min(100, percentage))

    // Calculate subtle stretch
    let stretchAmount = 0
    const stretchFactor = 5
    const maxStretch = 2

    if (percentage > 100) {
      stretchAmount = Math.max((100 - percentage) / stretchFactor, -maxStretch)
      setStretchDirection('left')
    } else if (percentage < 0) {
      stretchAmount = Math.min((0 - percentage) / stretchFactor, maxStretch)
      setStretchDirection('right')
    }

    stretchRaw.set(Math.max(-maxStretch, Math.min(maxStretch, stretchAmount)))

    const newValue = Math.round((clampedPercentage / 100) * (max - min) + min)
    const steppedValue = step > 0 ? Math.round(newValue / step) * step : newValue

    if (controlledValue === undefined) {
      setInternalValue(steppedValue)
    }
    onChange?.(steppedValue)
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerDownPos.current = e.clientX
    setIsDragging(true)
    setIsClick(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    handlePointerMove(e.clientX, true)
  }

  React.useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging) return
      
      // If mouse moved more than 3px, it's a drag not a click
      if (Math.abs(e.clientX - pointerDownPos.current) > 3) {
        setIsClick(false)
      }
      
      e.preventDefault()
      handlePointerMove(e.clientX)
    }

    const handleUp = () => {
      if (isDragging) {
        setIsDragging(false)
        stretchRaw.set(0)
        // Reset click state after a short delay
        setTimeout(() => setIsClick(false), 100)
      }
    }

    if (isDragging) {
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
      window.addEventListener('pointercancel', handleUp)
    }

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [isDragging])

  const percentValue = ((value - min) / (max - min)) * 100

  return (
    <div className={cn("w-full select-none touch-none", className)}>
      

      <motion.div
        className="relative"
        style={{
          scaleX,
          transformOrigin: stretchDirection,
        }}
      >
        <div
          ref={trackRef}
          className="relative h-14 rounded-2xl bg-neutral-800/60 border border-neutral-700/15 cursor-pointer overflow-hidden"
          onPointerDown={handlePointerDown}
        >
            <div className="absolute inset-0 flex justify-between items-center px-6 pointer-events-none z-10">
          <span className="text-neutral-300 font-medium text-base">{label}</span>
          <span className="text-white font-semibold text-xl tabular-nums">{value}</span>
        </div>
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-neutral-600/50 rounded-full"
              />
            ))}
          </div>
          {/* Filled track */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-neutral-800 rounded-2xl"
            animate={{
              width: `${percentValue}%`,
            }}
            transition={
              isClick
                ? {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }
                : isDragging
                ? {
                    type: "spring",
                    stiffness: 400,
                    damping: 35,
                    mass: 0.4
                  }
                : {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8
                  }
            }
          >
            {/* Right edge indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white/50 rounded-full" />
          </motion.div>
        </div>
      </motion.div>
      
    </div>
  )
}