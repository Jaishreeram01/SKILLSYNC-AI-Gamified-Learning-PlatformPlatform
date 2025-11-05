"use client"

import { useState, useCallback } from "react"
import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import { useToast } from "@/hooks/use-toast"

interface UploadOptions {
  folder: string
  maxSize?: number // in bytes
  allowedTypes?: string[]
}

export function useImageUpload(options: UploadOptions) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setIsLoading(true)
        setProgress(0)

        const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB default
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: `Maximum file size is ${maxSize / 1024 / 1024}MB`,
            variant: "destructive",
          })
          return null
        }

        const allowedTypes = options.allowedTypes || ["image/jpeg", "image/png", "image/webp", "image/gif"]
        if (!allowedTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `Allowed types: ${allowedTypes.join(", ")}`,
            variant: "destructive",
          })
          return null
        }

        const timestamp = Date.now()
        const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`
        const storageRef = ref(storage, `${options.folder}/${filename}`)

        setProgress(30)
        await uploadBytes(storageRef, file)
        setProgress(70)

        const downloadURL = await getDownloadURL(storageRef)
        setProgress(100)

        toast({
          title: "Upload successful",
          description: "Your image has been uploaded.",
        })

        return downloadURL
      } catch (error) {
        console.error("[v0] Upload error:", error)
        toast({
          title: "Upload failed",
          description: "There was an error uploading your image.",
          variant: "destructive",
        })
        return null
      } finally {
        setIsLoading(false)
        setProgress(0)
      }
    },
    [options, toast],
  )

  const deleteFile = useCallback(
    async (fileURL: string): Promise<boolean> => {
      try {
        const pathStart = fileURL.indexOf("/o/") + 3
        const pathEnd = fileURL.indexOf("?")
        const filePath = decodeURIComponent(fileURL.substring(pathStart, pathEnd))

        const fileRef = ref(storage, filePath)
        await deleteObject(fileRef)

        toast({
          title: "Image deleted",
          description: "Your image has been removed.",
        })

        return true
      } catch (error) {
        console.error("[v0] Delete error:", error)
        toast({
          title: "Delete failed",
          description: "There was an error deleting your image.",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  return { upload, deleteFile, isLoading, progress }
}
