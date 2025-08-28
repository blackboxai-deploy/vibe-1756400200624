import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const reportId = params.id

    // Get report from global store (use database in production)
    const reportStore = (global as any)?.reportStore || new Map()
    const report = reportStore.get(reportId)

    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(report)

  } catch (error) {
    console.error('Report fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    )
  }
}