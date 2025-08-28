'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DiagnosticReport {
  id: string
  timestamp: string
  imageUrl: string
  findings: {
    overview: string
    detailed: string[]
    recommendations: string[]
    confidence: number
  }
  metadata: {
    imageType: string
    processingTime: number
    aiModel: string
  }
}

export default function ReportPage() {
  const params = useParams()
  const reportId = params.id as string
  
  const [report, setReport] = useState<DiagnosticReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/reports/${reportId}`)
        
        if (!response.ok) {
          throw new Error('Report not found')
        }

        const reportData: DiagnosticReport = await response.json()
        setReport(reportData)
      } catch (error) {
        console.error('Error fetching report:', error)
        setError(error instanceof Error ? error.message : 'Failed to load report')
      } finally {
        setLoading(false)
      }
    }

    if (reportId) {
      fetchReport()
    }
  }, [reportId])

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `radiology-report-${reportId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="border-b bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">RadiologyAI</h1>
            </Link>
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
                  Start New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!report) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm print:hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">RadiologyAI</h1>
            </Link>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handlePrint}>
                Print Report
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                Download PDF
              </Button>
              <Link href="/upload">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  New Analysis
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 print:py-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg print:shadow-none print:rounded-none">
          {/* Report Header */}
          <div className="p-8 border-b">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Diagnostic Report
                </h1>
                <p className="text-gray-600">
                  Generated by RadiologyAI • {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="bg-green-100 text-green-800 mb-2">
                  AI Analysis Complete
                </Badge>
                <p className="text-sm text-gray-600">Report ID: {report.id}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Image Type:</span>
                <p className="text-gray-600">{report.metadata.imageType}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Processing Time:</span>
                <p className="text-gray-600">{report.metadata.processingTime}s</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">AI Model:</span>
                <p className="text-gray-600">{report.metadata.aiModel}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 p-8">
            {/* Image Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">X-Ray Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={report.imageUrl}
                    alt="X-ray analysis"
                    className="w-full h-64 object-contain bg-gray-100 rounded-lg mb-4"
                  />
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Confidence: {report.findings.confidence}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Findings Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Clinical Overview</CardTitle>
                  <CardDescription>
                    AI-generated summary of key findings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {report.findings.overview}
                  </p>
                </CardContent>
              </Card>

              {/* Detailed Findings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Findings</CardTitle>
                  <CardDescription>
                    Comprehensive analysis of anatomical structures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {report.findings.detailed.map((finding, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{finding}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                  <CardDescription>
                    AI-suggested next steps and considerations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {report.findings.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700">{recommendation}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t bg-gray-50">
            <div className="text-center space-y-4">
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800 text-center">
                  <strong>Important:</strong> This AI-generated report is for informational purposes only. 
                  It should be reviewed by a qualified radiologist and used as a diagnostic aid, not a replacement for professional medical judgment.
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <span>RadiologyAI v2.0</span>
                <Separator orientation="vertical" className="h-4" />
                <span>HIPAA Compliant</span>
                <Separator orientation="vertical" className="h-4" />
                <span>Medical AI Platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-6 text-center print:hidden">
          <div className="flex justify-center space-x-4">
            <Link href="/upload">
              <Button variant="outline" size="lg">
                Analyze Another Image
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
            >
              Back to Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}