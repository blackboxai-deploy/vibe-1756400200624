import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const params = await context.params
  try {
    const filename = params.filename
    const filepath = join(UPLOAD_DIR, filename)

    // Read the file
    const fileBuffer = await readFile(filepath)
    
    // Determine content type
    const extension = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'png':
        contentType = 'image/png'
        break
      case 'dcm':
        contentType = 'application/dicom'
        break
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Image serve error:', error)
    return NextResponse.json(
      { error: 'Image not found' },
      { status: 404 }
    )
  }
}