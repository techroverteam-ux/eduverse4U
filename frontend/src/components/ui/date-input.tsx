"use client"

import { useState, useRef } from 'react'
import { Calendar } from 'lucide-react'

interface DateInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  required?: boolean
  readOnly?: boolean
  placeholder?: string
}

export function DateInput({ value, onChange, className = '', required, readOnly, placeholder }: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false)
  const hiddenInputRef = useRef<HTMLInputElement>(null)

  const formatDisplayDate = (dateString: string): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    
    const day = String(date.getDate()).padStart(2, '0')
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day}-${month}-${year}`
  }

  const handleClick = () => {
    if (!readOnly && hiddenInputRef.current) {
      hiddenInputRef.current.showPicker?.()
    }
  }

  return (
    <div className="relative">
      <div
        onClick={handleClick}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-purple-500 cursor-pointer flex items-center justify-between ${className} ${
          readOnly ? 'bg-gray-50 cursor-not-allowed' : 'bg-white hover:border-gray-400'
        }`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value ? formatDisplayDate(value) : placeholder || 'Select date'}
        </span>
        <Calendar className="h-4 w-4 text-gray-400" />
      </div>
      
      <input
        ref={hiddenInputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer"
        required={required}
        readOnly={readOnly}
        tabIndex={-1}
      />
    </div>
  )
}