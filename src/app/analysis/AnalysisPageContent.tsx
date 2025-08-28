'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface AnalysisStatus {
  id: string
  status: 'uploading' | 'analyzing' | 'completed' | 'error'
  progress: number
  message: string
  imageUrl?: string
  reportId?: string
  error?: string
}

export default function AnalysisPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const analysisId = searchParams.get('id')
  
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!analysisId) {
      setError('No analysis ID provided')
      return
    }

    // Start polling for analysis status
    const pollAnalysis = async () => {
      try {
        const response = await fetch(`/api/analyze?id=${analysisId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch analysis status')
        }

        const status: AnalysisStatus = await response.json()
        setAnalysisStatus(status)

        if (status.status === 'completed' && status.reportId) {
          // Redirect to report page after a brief delay
          setTimeout(() => {
            router.push(`/report/${status.reportId}`)
          }, 2000)
        } else if (status.status === 'error') {
          setError(status.error || 'Analysis failed')
        } else if (status.status === 'analyzing' || status.status === 'uploading') {
          // Continue polling
          setTimeout(pollAnalysis, 2000)
        }
      } catch (error) {
        console.error('Polling error:', error)
        setError(error instanceof Error ? error.message : 'Failed to check analysis status')
      }
    }

    pollAnalysis()
  }, [analysisId, router])

  const getStatusMessage = () => {
    if (!analysisStatus) return 'Loading...'
    
    switch (analysisStatus.status) {
      case 'uploading':
        return 'Uploading and processing image...'
      case 'analyzing':
        return 'AI is analyzing your X-ray image...'
      case 'completed':
        return 'Analysis completed! Generating report...'
      case 'error':
        return 'Analysis failed'
      default:
        return 'Processing...'
    }
  }

  const getStatusColor = () => {
    if (!analysisStatus) return 'bg-gray-100 text-gray-800'
    
    switch (analysisStatus.status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800'
      case 'analyzing':
        return 'bg-yellow-100 text-yellow-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const currentProgress = analysisStatus?.progress ?? 0

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <h1 className="text-xl font-bold text-gray-900">RadiologyAI</h1>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Try Another Upload
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">RadiologyAI</h1>
            </Link>
            <Link href="/upload">
              <Button variant="ghost">New Analysis</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              AI Analysis in Progress
            </h1>
            <p className="text-lg text-gray-600">
              Please wait while our AI analyzes your X-ray image
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Analysis Status
                  <Badge variant="secondary" className={getStatusColor()}>
                    {analysisStatus?.status || 'Loading'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Analysis ID: {analysisId}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {getStatusMessage()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {currentProgress}%
                    </span>
                  </div>
                  <Progress value={currentProgress} className="w-full" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentProgress > 0 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Image uploaded successfully</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentProgress > 30 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Image preprocessing completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentProgress > 60 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">AI analysis in progress</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      currentProgress > 90 ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-sm">Generating diagnostic report</span>
                  </div>
                </div>

                {analysisStatus?.status === 'completed' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Analysis Complete!</h3>
                    <p className="text-sm text-green-800">
                      Your diagnostic report is ready. You will be redirected shortly...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>X-Ray Image</CardTitle>
                <CardDescription>
                  The image being analyzed by our AI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisStatus?.imageUrl ? (
                  <img
                    src={analysisStatus.imageUrl}
                    alt="X-ray being analyzed"
                    className="w-full h-64 object-contain bg-gray-100 rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Loading image...</p>
                    </div>
                  </div>
                )}

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">AI Analysis Features</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Advanced computer vision analysis</li>
                    <li>• Pattern recognition and anomaly detection</li>
                    <li>• Medical-grade accuracy standards</li>
                    <li>• Comprehensive diagnostic reporting</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>What&apos;s Happening?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Image Processing</h3>
                  <p className="text-sm text-gray-600">
                    Enhancing image quality and preparing for analysis
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">AI Analysis</h3>
                  <p className="text-sm text-gray-600">
                    Advanced AI examines patterns and structures
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Report Generation</h3>
                  <p className="text-sm text-gray-600">
                    Creating comprehensive diagnostic findings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}