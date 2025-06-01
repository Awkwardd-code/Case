import { createUploadthing, type FileRouter } from "uploadthing/next"
import { z } from "zod"
import sharp from "sharp";
import { connectDB } from "@/config/connectDb";
import Configuration from "@/models/configurationSchema"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(z.object({ configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return { input }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input

      const res = await fetch(file.url)
      const buffer = await res.arrayBuffer()
      const imgMetadata = await sharp(buffer).metadata()

      const width = imgMetadata.width ?? 500
      const height = imgMetadata.height ?? 500

      await connectDB () ; 
      
      if (!configId) {
        const configuration = await Configuration.create({
          imageUrl: file.url,
          width,
          height,
        })

        return { configId: configuration._id }
      } else {
        const updatedConfiguration = await Configuration.findByIdAndUpdate(
          configId,
          {
            $set: { croppedImageUrl: file.url },
          },
          { new: true }
        )

        if (!updatedConfiguration) {
          throw new Error("Configuration not found")
        }

        return { configId: updatedConfiguration._id }
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
