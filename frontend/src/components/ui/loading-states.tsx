"use client"

import { Building2, Users, Sparkles } from 'lucide-react'

export const SchoolCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border p-6 animate-pulse">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="mt-4 grid grid-cols-3 gap-4">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
)

export const SchoolTableSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
    <div className="p-6 border-b">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
    <div className="divide-y">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
            <div className="w-20 h-4 bg-gray-200 rounded"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export const StatsCardSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-16 mb-1"></div>
        <div className="h-3 bg-gray-300 rounded w-20"></div>
      </div>
      <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
    </div>
  </div>
)

export const LoadingSpinner = ({ size = 'md', color = 'purple' }: { 
  size?: 'sm' | 'md' | 'lg'
  color?: 'purple' | 'blue' | 'green' | 'red'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }
  
  const colorClasses = {
    purple: 'border-purple-600 border-t-transparent',
    blue: 'border-blue-600 border-t-transparent',
    green: 'border-green-600 border-t-transparent',
    red: 'border-red-600 border-t-transparent'
  }

  return (
    <div className={`animate-spin rounded-full border-2 ${sizeClasses[size]} ${colorClasses[color]}`} />
  )
}

export const PulsingDot = ({ color = 'green' }: { color?: 'green' | 'red' | 'yellow' | 'blue' }) => {
  const colorClasses = {
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500'
  }

  return (
    <div className="relative">
      <div className={`h-2 w-2 ${colorClasses[color]} rounded-full`}></div>
      <div className={`absolute inset-0 h-2 w-2 ${colorClasses[color]} rounded-full animate-ping opacity-75`}></div>
    </div>
  )
}

export const SchoolsLoadingState = () => (
  <div className="space-y-6 p-4 max-w-7xl mx-auto">
    {/* Header Skeleton */}
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex space-x-3">
          <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <StatsCardSkeleton key={i} />
      ))}
    </div>

    {/* Filters Skeleton */}
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex gap-4">
        <div className="flex-1 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="w-32 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>

    {/* Table Skeleton */}
    <SchoolTableSkeleton />
  </div>
)

export const EmptyState = ({ 
  icon: Icon = Building2,
  title = "No data found",
  description = "There's nothing to show here yet.",
  action
}: {
  icon?: React.ComponentType<any>
  title?: string
  description?: string
  action?: React.ReactNode
}) => (
  <div className="text-center py-12">
    <div className="relative mb-6">
      <Icon className="h-16 w-16 text-gray-300 mx-auto" />
      <Sparkles className="h-6 w-6 text-gray-200 absolute -top-2 -right-2 animate-pulse" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    {action}
  </div>
)

export const ErrorState = ({ 
  title = "Something went wrong",
  description = "We encountered an error while loading the data.",
  onRetry
}: {
  title?: string
  description?: string
  onRetry?: () => void
}) => (
  <div className="text-center py-12">
    <div className="relative mb-6">
      <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
        <Building2 className="h-8 w-8 text-red-500" />
      </div>
      <div className="absolute -top-1 -right-1 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xs font-bold">!</span>
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Try Again
      </button>
    )}
  </div>
)