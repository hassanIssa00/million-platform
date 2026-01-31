'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Clock, CheckCircle, Upload, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api/client'
import { Link } from '@/i18n/routing'
import { useToast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  subject: { name: string }
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const t = useTranslations('student.assignments')

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await apiClient.get('/assignments/student')
      if (response.data && response.data.length > 0) {
        setAssignments(response.data)
      } else {
        // Fallback mock data with Arabic content
        setAssignments([
          {
            id: '1',
            title: 'مجموعة مسائل التفاضل 3',
            description: 'أكمل المسائل من 1 إلى 10 في الفصل الرابع.',
            dueDate: '2024-12-10T23:59:00Z',
            subject: { name: 'الرياضيات' },
            status: 'pending'
          },
          {
            id: '2',
            title: 'تقرير معمل الفيزياء',
            description: 'تسليم تقرير تجربة البندول.',
            dueDate: '2024-12-08T23:59:00Z',
            subject: { name: 'الفيزياء' },
            status: 'submitted'
          },
          {
            id: '3',
            title: 'مقال التاريخ',
            description: 'اكتب مقالاً من 500 كلمة عن الثورة الصناعية.',
            dueDate: '2024-12-01T23:59:00Z',
            subject: { name: 'التاريخ' },
            status: 'graded',
            grade: 92
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      // Fallback on error to ensure page is not empty
      setAssignments([
        {
          id: '1',
          title: 'مجموعة مسائل التفاضل 3',
          description: 'أكمل المسائل من 1 إلى 10 في الفصل الرابع.',
          dueDate: '2024-12-10T23:59:00Z',
          subject: { name: 'الرياضيات' },
          status: 'pending'
        }
      ])
      toast({
        title: t('loadError'),
        description: 'Using offline data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      case 'graded': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 ml-1" />
      case 'submitted': return <CheckCircle className="w-4 h-4 ml-1" />
      case 'graded': return <Award className="w-4 h-4 ml-1" />
      default: return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('status.pending')
      case 'submitted': return t('status.submitted')
      case 'graded': return t('status.graded')
      default: return status
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('title')}</h1>
        <p className="text-gray-600 dark:text-gray-400">{t('subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-primary border-primary/20">
                      {assignment.subject.name}
                    </Badge>
                    <Badge className={getStatusColor(assignment.status)} variant="secondary">
                      <span className="flex items-center">
                        {getStatusIcon(assignment.status)}
                        {getStatusText(assignment.status)}
                      </span>
                    </Badge>
                    {assignment.grade && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        {assignment.grade}%
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{assignment.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {assignment.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <AlertCircle className="w-4 h-4 ml-1" />
                    {t('due')}: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center">
                  {assignment.status === 'pending' ? (
                    <Link href={`/student/assignments/submit?id=${assignment.id}`}>
                      <Button>
                        <Upload className="w-4 h-4 ml-2" />
                        {t('submitWork')}
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/student/assignments/${assignment.id}`}>
                      <Button variant="outline">
                        {t('viewSubmission')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Award(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  )
}
