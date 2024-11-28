import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  const imagePath = path.join(process.cwd(), 'public', 'uploads', filename)

  try {
    const imageBuffer = await readFile(imagePath)
    const response = new NextResponse(imageBuffer)
    response.headers.set('Content-Type', 'image/png') // Adjust this based on your image types
    return response
  } catch (error) {
    console.error('Error reading image:', error)
    return new NextResponse('Image not found', { status: 404 })
  }
}

