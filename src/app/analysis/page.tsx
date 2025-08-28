'use client'

import { Suspense } from 'react'
import AnalysisPageContent from './AnalysisPageContent'

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analysis...</p>
      </div>
    </div>}>
      <AnalysisPageContent />
    </Suspense>
  )
}