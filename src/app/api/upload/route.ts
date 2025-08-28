import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const UPLOAD_DIR = join(process.cwd(), 'uploads')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/dicom']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const isValidType = ALLOWED_TYPES.includes(file.type) || 
                       file.name.toLowerCase().endsWith('.dcm')
    
    if (!isValidType) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or DICOM files.' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Generate unique ID and filename
    const id = randomUUID()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${id}.${extension}`
    const filepath = join(UPLOAD_DIR, filename)

    // Ensure upload directory exists
    try {
      await mkdir(UPLOAD_DIR, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Start analysis process
    const analysisResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      })
    })

    if (!analysisResponse.ok) {
      console.error('Failed to start analysis')
      // Continue anyway, analysis can be retried
    }

    return NextResponse.json({
      id,
      filename,
      size: file.size,
      type: file.type,
      message: 'File uploaded successfully'
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}