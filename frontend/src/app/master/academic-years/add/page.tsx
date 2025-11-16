"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

import { ArrowLeft, Save, Calendar } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"
import { useRouter, useSearchParams } from 'next/navigation'
import { DateInput } from "@/components/ui/date-input"

export default function AddAcademicYearPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { filters, loading: filtersLoading } = useFilters()
  
  const mode = searchParams.get('mode') || 'add'
  const editId = searchParams.get('id')
  
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    schoolId: '',
    branchId: '',
    description: '',
    isActive: true,
    isCurrent: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filteredBranches, setFilteredBranches] = useState<any[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && editId) {
      fetchAcademicYear(editId)
    } else if (filters.schools.length > 0 && !formData.schoolId) {
      setFormData(prev => ({ ...prev, schoolId: filters.schools[0]?.id || '' }))
    }
  }, [mode, editId, filters.schools, formData.schoolId])

  useEffect(() => {
    setFilteredBranches(filters.branches.filter(b => b.schoolId === formData.schoolId))
  }, [formData.schoolId, filters.branches])

  const validateAcademicYearName = (name: string): string | null => {
    if (!name.trim()) return 'Academic year name is required'
    
    const yearPattern = /^\d{4}-\d{2}$/
    if (!yearPattern.test(name)) {
      return 'Format should be YYYY-YY (e.g., 2024-25)'
    }
    
    const [startYear, endYearShort] = name.split('-')
    const startYearNum = parseInt(startYear)
    const endYearNum = parseInt('20' + endYearShort)
    
    if (endYearNum !== startYearNum + 1) {
      return 'End year should be exactly one year after start year'
    }
    
    const currentYear = new Date().getFullYear()
    if (startYearNum < currentYear - 5 || startYearNum > currentYear + 5) {
      return 'Academic year should be within 5 years of current year'
    }
    
    return null
  }

  const validateDates = (startDate: string, endDate: string): { startDate?: string; endDate?: string } => {
    const errors: { startDate?: string; endDate?: string } = {}
    
    if (!startDate) errors.startDate = 'Start date is required'
    if (!endDate) errors.endDate = 'End date is required'
    
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start >= end) {
        errors.endDate = 'End date must be after start date'
      }
      
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      if (diffMonths < 10 || diffMonths > 14) {
        errors.endDate = 'Academic year should be 10-14 months long'
      }
    }
    
    return errors
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    const nameError = validateAcademicYearName(formData.name)
    if (nameError) newErrors.name = nameError
    
    const dateErrors = validateDates(formData.startDate, formData.endDate)
    Object.assign(newErrors, dateErrors)
    
    if (!formData.schoolId) newErrors.schoolId = 'School selection is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const fetchAcademicYear = async (id: string) => {
    try {
      setLoading(true)
      const data = await masterAPI.getAcademicYear(id)
      setFormData({
        name: data.name,
        startDate: new Date(data.startDate).toISOString().split('T')[0],
        endDate: new Date(data.endDate).toISOString().split('T')[0],
        schoolId: data.schoolId,
        branchId: data.branchId || '',
        description: data.description || '',
        isActive: data.isActive,
        isCurrent: data.isCurrent
      })
    } catch (error) {
      console.error('Failed to fetch academic year:', error)
      toast.error('Failed to load academic year')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      if (mode === 'edit' && editId) {
        console.log('Updating academic year with data:', formData)
        await masterAPI.updateAcademicYear(editId, formData)
        toast.success('Academic year updated successfully')
      } else {
        console.log('Creating academic year with data:', formData)
        await masterAPI.createAcademicYear(formData)
        toast.success('Academic year created successfully')
      }
      router.replace('/master/academic-years')
    } catch (error) {
      console.error(`Failed to ${mode} academic year:`, error)
      toast.error(`Failed to ${mode} academic year`)
    } finally {
      setSaving(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({...formData, name: value})
    if (errors.name) setErrors({...errors, name: ''})
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData({...formData, [field]: value})
    if (errors[field]) setErrors({...errors, [field]: ''})
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Compact Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-purple-600" />
          <h1 className="text-lg font-semibold text-gray-900">{mode === 'edit' ? 'Edit Academic Year' : 'Add Academic Year'}</h1>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()} className="h-8">
          <ArrowLeft className="h-3 w-3 mr-1" />
          Back
        </Button>
      </div>

      {/* Form */}
      <div className="flex-1 p-4 overflow-auto">
        <form id="academic-year-form" onSubmit={handleSubmit} className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={handleNameChange}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-purple-500 transition-colors ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="2024-25"
                    required
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 resize-none"
                    rows={2}
                    placeholder="Brief description..."
                  />
                </div>
              </div>
            </div>
            
            {/* School & Branch Card */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                School & Branch
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    School <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.schoolId}
                    onChange={(e) => setFormData({...formData, schoolId: e.target.value, branchId: ''})}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-purple-500 ${
                      errors.schoolId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    required
                    disabled={filtersLoading}
                  >
                    <option value="">Select School</option>
                    {filters.schools.map(school => (
                      <option key={school.id} value={school.id}>{school.name}</option>
                    ))}
                  </select>
                  {errors.schoolId && (
                    <p className="mt-1 text-xs text-red-600">{errors.schoolId}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({...formData, branchId: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500"
                    disabled={!formData.schoolId}
                  >
                    <option value="">All Branches</option>
                    {filteredBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Dates & Status Card */}
            <div className="bg-white rounded-lg border shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Dates & Status
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <DateInput
                      value={formData.startDate}
                      onChange={(value) => handleDateChange('startDate', value)}
                      className={errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                      required
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <DateInput
                      value={formData.endDate}
                      onChange={(value) => handleDateChange('endDate', value)}
                      className={errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'}
                      required
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                        className="h-3 w-3 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-xs font-medium text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isCurrent}
                        onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                        className="h-3 w-3 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className="text-xs font-medium text-gray-700">Current Year</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t bg-white px-4 py-3">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button 
            type="submit" 
            form="academic-year-form"
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? (mode === 'edit' ? 'Updating...' : 'Creating...') : (mode === 'edit' ? 'Update Academic Year' : 'Create Academic Year')}
          </Button>
        </div>
      </div>
    </div>
  )
}