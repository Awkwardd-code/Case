/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/config/connectDb'
import Configuration from '@/models/configurationSchema'

export async function POST(req: NextRequest) {
  try {
    const { configurationId } = await req.json()

    if (!configurationId) {
      return NextResponse.json({ error: 'Missing configurationId' }, { status: 400 })
    }

    await connectDB()

    const configuration = await Configuration.findById(configurationId)

    if (!configuration) {
      return NextResponse.json({ error: 'Configuration not found' }, { status: 404 })
    }

    return NextResponse.json({
      configuration: {
        croppedImageUrl: configuration.croppedImageUrl,
        color: configuration.color,
      },
    })
  } catch (error: any) {
    console.error('API Configuration Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
