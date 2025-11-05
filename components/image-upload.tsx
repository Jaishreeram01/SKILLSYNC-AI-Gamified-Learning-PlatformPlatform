"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { useImageUpload } from "@/hooks/use-image-upload"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onUpload: (url: string) => void
  onDelete?: (url: string) => void
  folder: string
  preview?: string
  aspectRatio?: "square" | "video" | "auto"
  maxSize?: number
  className?: string
}

export function ImageUpload({
  onUpload,
  onDelete,
  folder,
  preview,
  aspectRatio = "square",
  maxSize = 5 * 1024 * 1024,
  className = "",
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview)
  const inputRef = useRef<HTMLInputElement>(null)
  const { upload, isLoading, progress } = useImageUpload({ folder, maxSize })

  const aspectRatioClasses = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "aspect-auto",
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = useCallback(
    async (file: File) => {
      const localPreview = URL.createObjectURL(file)
      setPreviewUrl(localPreview)

      const uploadedUrl = await upload(file)
      if (uploadedUrl) {
        setPreviewUrl(uploadedUrl)
        onUpload(uploadedUrl)
      } else {
        setPreviewUrl(preview)
      }
    },
    [upload, onUpload, preview],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      const files = e.dataTransfer.files
      if (files && files[0]) {
        processFile(files[0])
      }
    },
    [processFile],
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleClear = () => {
    setPreviewUrl(undefined)
    if (previewUrl && onDelete) {
      onDelete(previewUrl)
    }
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      {previewUrl ? (
        <div className={`relative ${aspectRatioClasses[aspectRatio]} rounded-lg overflow-hidden border border-border`}>
          <Image
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <button
            onClick={handleClear}
            disabled={isLoading}
            className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive rounded-full text-white transition disabled:opacity-50"
          >
            <X size={16} />
          </button>
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-white" size={24} />
                <span className="text-white text-sm">{progress}%</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`${aspectRatioClasses[aspectRatio]} flex items-center justify-center cursor-pointer transition ${
            dragActive ? "border-primary bg-primary/10" : "border-border border-dashed"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            disabled={isLoading}
            className="hidden"
          />

          <div
            className="flex flex-col items-center justify-center gap-2 text-center"
            onClick={() => !isLoading && inputRef.current?.click()}
          >
            <div className="p-3 rounded-lg bg-primary/10">
              <Upload size={24} className="text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Drag image here or click</p>
              <p className="text-sm text-muted-foreground">PNG, JPG, WebP up to 5MB</p>
            </div>
            {isLoading && <p className="text-sm text-primary">{progress}% uploaded</p>}
          </div>
        </Card>
      )}
    </div>
  )
}
