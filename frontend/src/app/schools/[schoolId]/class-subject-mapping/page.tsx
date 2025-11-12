"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Link2, BookOpen, GraduationCap, Users, 
  CheckCircle, AlertCircle, Save, RefreshCw
} from "lucide-react"

interface ClassSubjectMapping {
  classId: string
  className: string
  sections: string[]
  subjects: SubjectMapping[]
}

interface SubjectMapping {
  subjectId: string
  subjectName: string
  subjectCode: string
  isAssigned: boolean
  periodsPerWeek: number
  teacher?: {
    id: string
    name: string
  }
}

interface Class {
  id: string
  name: string
  sections: string[]
}

interface Subject {
  id: string
  name: string
  code: string
  type: string
}

export default function ClassSubjectMappingPage({ params }: { params: { schoolId: string } }) {
  const [mappings, setMappings] = useState<ClassSubjectMapping[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    fetchData()
  }, [params.schoolId])

  const fetchData = async () => {
    try {
      const [mappingsRes, classesRes, subjectsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/class-subject-mappings`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/classes`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/subjects`)
      ])

      if (mappingsRes.ok && classesRes.ok && subjectsRes.ok) {
        const [mappingsData, classesData, subjectsData] = await Promise.all([
          mappingsRes.json(),
          classesRes.json(),
          subjectsRes.json()
        ])
        
        setMappings(mappingsData)
        setClasses(classesData)
        setSubjects(subjectsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
      // Mock data with Indian education system
      setClasses([
        { id: '1', name: 'Nursery', sections: ['A'] },
        { id: '2', name: 'LKG', sections: ['A'] },
        { id: '3', name: 'UKG', sections: ['A'] },
        { id: '4', name: '1', sections: ['A', 'B'] },
        { id: '5', name: '2', sections: ['A', 'B'] },
        { id: '6', name: '3', sections: ['A', 'B'] },
        { id: '7', name: '4', sections: ['A', 'B'] },
        { id: '8', name: '5', sections: ['A', 'B'] },
        { id: '9', name: '6', sections: ['A', 'B'] },
        { id: '10', name: '7', sections: ['A', 'B'] },
        { id: '11', name: '8', sections: ['A', 'B'] },
        { id: '12', name: '9', sections: ['A', 'B'] },
        { id: '13', name: '10', sections: ['A', 'B'] },
        { id: '14', name: '11', sections: ['Science', 'Commerce', 'Arts'] },
        { id: '15', name: '12', sections: ['Science', 'Commerce', 'Arts'] }
      ])

      setSubjects([
        { id: '1', name: 'English', code: 'ENG', type: 'core' },
        { id: '2', name: 'Hindi', code: 'HIN', type: 'core' },
        { id: '3', name: 'Mathematics', code: 'MAT', type: 'core' },
        { id: '4', name: 'Science', code: 'SCI', type: 'core' },
        { id: '5', name: 'Social Science', code: 'SSC', type: 'core' },
        { id: '6', name: 'Physics', code: 'PHY', type: 'core' },
        { id: '7', name: 'Chemistry', code: 'CHE', type: 'core' },
        { id: '8', name: 'Biology', code: 'BIO', type: 'core' },
        { id: '9', name: 'Computer Science', code: 'CS', type: 'elective' },
        { id: '10', name: 'Sanskrit', code: 'SAN', type: 'language' },
        { id: '11', name: 'Physical Education', code: 'PE', type: 'activity' },
        { id: '12', name: 'Art', code: 'ART', type: 'activity' },
        { id: '13', name: 'EVS', code: 'EVS', type: 'core' }
      ])

      // Generate mock mappings
      const mockMappings = classes.map(cls => ({
        classId: cls.id,
        className: cls.name,
        sections: cls.sections,
        subjects: getDefaultSubjectsForClass(cls.name, subjects)
      }))
      
      setMappings(mockMappings)
    } finally {
      setLoading(false)
    }
  }

  const getDefaultSubjectsForClass = (className: string, allSubjects: Subject[]): SubjectMapping[] => {
    const defaultMappings: { [key: string]: string[] } = {
      'Nursery': ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
      'LKG': ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
      'UKG': ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
      '1': ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
      '2': ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
      '3': ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Art', 'Physical Education'],
      '4': ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Art', 'Physical Education'],
      '5': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Art', 'Physical Education'],
      '6': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'],
      '7': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'],
      '8': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'],
      '9': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Physical Education'],
      '10': ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Physical Education'],
      '11': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'],
      '12': ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education']
    }

    const classSubjects = defaultMappings[className] || []
    
    return allSubjects.map(subject => ({
      subjectId: subject.id,
      subjectName: subject.name,
      subjectCode: subject.code,
      isAssigned: classSubjects.includes(subject.name),
      periodsPerWeek: classSubjects.includes(subject.name) ? getDefaultPeriods(subject.name, className) : 0
    }))
  }

  const getDefaultPeriods = (subjectName: string, className: string): number => {
    const periodMappings: { [key: string]: number } = {
      'English': 6,
      'Hindi': 6,
      'Mathematics': 7,
      'Science': 6,
      'Social Science': 5,
      'Physics': 6,
      'Chemistry': 6,
      'Biology': 6,
      'Computer Science': 2,
      'Sanskrit': 3,
      'Physical Education': 2,
      'Art': 2,
      'EVS': 4
    }
    
    return periodMappings[subjectName] || 3
  }

  const toggleSubjectAssignment = (classId: string, subjectId: string) => {
    setMappings(prev => prev.map(mapping => {
      if (mapping.classId === classId) {
        return {
          ...mapping,
          subjects: mapping.subjects.map(subject => {
            if (subject.subjectId === subjectId) {
              return {
                ...subject,
                isAssigned: !subject.isAssigned,
                periodsPerWeek: !subject.isAssigned ? getDefaultPeriods(subject.subjectName, mapping.className) : 0
              }
            }
            return subject
          })
        }
      }
      return mapping
    }))
    setHasChanges(true)
  }

  const updatePeriodsPerWeek = (classId: string, subjectId: string, periods: number) => {
    setMappings(prev => prev.map(mapping => {
      if (mapping.classId === classId) {
        return {
          ...mapping,
          subjects: mapping.subjects.map(subject => {
            if (subject.subjectId === subjectId) {
              return { ...subject, periodsPerWeek: periods }
            }
            return subject
          })
        }
      }
      return mapping
    }))
    setHasChanges(true)
  }

  const saveMappings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/class-subject-mappings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mappings })
      })

      if (response.ok) {
        alert('Class-Subject mappings saved successfully!')
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to save mappings:', error)
      alert('Failed to save mappings')
    }
  }

  const applyDefaultMapping = async () => {
    if (!confirm('This will reset all mappings to Indian education system defaults. Continue?')) return
    
    const defaultMappings = classes.map(cls => ({
      classId: cls.id,
      className: cls.name,
      sections: cls.sections,
      subjects: getDefaultSubjectsForClass(cls.name, subjects)
    }))
    
    setMappings(defaultMappings)
    setHasChanges(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const selectedMapping = mappings.find(m => m.classId === selectedClass)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Button variant="outline" asChild>
                <a href={`/schools/${params.schoolId}/manage`}>← Back</a>
              </Button>
              <h1 className="text-3xl font-bold">Class-Subject Mapping</h1>
            </div>
            <p className="text-gray-600">Configure which subjects are taught in each class</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={applyDefaultMapping}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Apply Defaults
            </Button>
            <Button onClick={saveMappings} disabled={!hasChanges}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Class Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Classes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mappings.map((mapping) => (
                  <button
                    key={mapping.classId}
                    onClick={() => setSelectedClass(mapping.classId)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedClass === mapping.classId 
                        ? 'bg-blue-50 border-blue-200 text-blue-900' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Class {mapping.className}</span>
                      <span className="text-sm text-gray-500">
                        {mapping.subjects.filter(s => s.isAssigned).length} subjects
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Sections: {mapping.sections.join(', ')}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Subject Mapping */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Link2 className="h-5 w-5" />
                <span>
                  {selectedMapping ? `Class ${selectedMapping.className} - Subject Mapping` : 'Select a Class'}
                </span>
              </CardTitle>
              {selectedMapping && (
                <CardDescription>
                  Configure subjects and weekly periods for Class {selectedMapping.className}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {selectedMapping ? (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedMapping.subjects.filter(s => s.isAssigned).length}
                      </p>
                      <p className="text-sm text-gray-600">Assigned Subjects</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedMapping.subjects.reduce((sum, s) => sum + (s.isAssigned ? s.periodsPerWeek : 0), 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Periods/Week</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedMapping.sections.length}
                      </p>
                      <p className="text-sm text-gray-600">Sections</p>
                    </div>
                  </div>

                  {/* Subjects Grid */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {selectedMapping.subjects.map((subject) => (
                      <div
                        key={subject.subjectId}
                        className={`p-4 border rounded-lg transition-colors ${
                          subject.isAssigned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={subject.isAssigned}
                              onChange={() => toggleSubjectAssignment(selectedMapping.classId, subject.subjectId)}
                              className="w-4 h-4"
                            />
                            <div>
                              <h4 className="font-medium">{subject.subjectName}</h4>
                              <p className="text-sm text-gray-600">{subject.subjectCode}</p>
                            </div>
                          </div>
                          {subject.isAssigned ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>

                        {subject.isAssigned && (
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Periods per Week
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={subject.periodsPerWeek}
                              onChange={(e) => updatePeriodsPerWeek(
                                selectedMapping.classId, 
                                subject.subjectId, 
                                parseInt(e.target.value) || 0
                              )}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Class</h3>
                  <p className="text-gray-600">Choose a class from the left panel to configure subject mappings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Indian Education System Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h4 className="font-medium mb-2">Primary Classes (1-5)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Core: English, Hindi, Mathematics, EVS</li>
                  <li>• Activities: Art, Physical Education</li>
                  <li>• Computer Science from Class 3</li>
                  <li>• Total: 30-35 periods/week</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Middle Classes (6-8)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Core: English, Hindi, Math, Science, Social Science</li>
                  <li>• Language: Sanskrit (optional)</li>
                  <li>• Elective: Computer Science</li>
                  <li>• Total: 35-40 periods/week</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Secondary+ (9-12)</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Class 9-10: Board preparation subjects</li>
                  <li>• Class 11-12: Stream-based subjects</li>
                  <li>• Science: Physics, Chemistry, Biology/Math</li>
                  <li>• Total: 40-45 periods/week</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}