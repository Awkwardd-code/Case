/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { connectDB } from '@/config/connectDb'
import Configuration from '@/models/configurationSchema'

// Your Mongoose enum objects (you can also import them if defined elsewhere)
const CaseColor = {
  BLACK: 'black',
  BLUE: 'blue',
  ROSE: 'rose',
} as const

const CaseFinish = {
  SMOOTH: 'smooth',
  TEXTURED: 'textured',
} as const

const CaseMaterial = {
  SILICONE: 'silicone',
  POLYCARBONATE: 'polycarbonate',
} as const

const PhoneModel = {
  IPHONEX: 'iphonex',
  IPHONE11: 'iphone11',
  IPHONE12: 'iphone12',
  IPHONE13: 'iphone13',
  IPHONE14: 'iphone14',
  IPHONE15: 'iphone15',
} as const

// Types based on Mongoose enum values
export type SaveConfigArgs = {
  color: (typeof CaseColor)[keyof typeof CaseColor]
  finish: (typeof CaseFinish)[keyof typeof CaseFinish]
  material: (typeof CaseMaterial)[keyof typeof CaseMaterial]
  model: (typeof PhoneModel)[keyof typeof PhoneModel]
  configId: string
}

export async function saveConfig({
  color,
  finish,
  material,
  model,
  configId,
}: SaveConfigArgs) {
  try {
    await connectDB()

    const result = await Configuration.updateOne(
      { _id: configId },
      { $set: { color, finish, material, model } }
    )

    if (result.modifiedCount === 0) {
      throw new Error('Configuration not found or no changes made.')
    }

    return { success: true }
  } catch (error) {
    console.error('Error saving config:', error)
    throw new Error('Failed to save configuration. Please try again later.')
  }
}
