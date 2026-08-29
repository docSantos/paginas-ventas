'use client'

import { useState, useCallback } from 'react'
import { UploadCloud, X, Loader2, GripVertical } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface ImageUploaderProps {
  initialFotos: string[]
  onChange: (fotos: string[]) => void
}

export function ImageUploader({ initialFotos, onChange }: ImageUploaderProps) {
  const [fotos, setFotos] = useState<string[]>(initialFotos)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const uploadedUrls: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError, data } = await supabase.storage
          .from('fotos-casas')
          .upload(filePath, file)

        if (uploadError) {
          throw uploadError
        }

        if (data) {
          const { data: urlData } = supabase.storage
            .from('fotos-casas')
            .getPublicUrl(filePath)
            
          uploadedUrls.push(urlData.publicUrl)
        }
      }

      const newFotos = [...fotos, ...uploadedUrls]
      setFotos(newFotos)
      onChange(newFotos)
    } catch (error: any) {
      alert("Error al subir imagen: " + error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }, [fotos])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const removeFoto = (indexToRemove: number) => {
    // Nota: idealmente también deberíamos borrarla del storage, 
    // pero para este MVP simplemente la quitamos del array.
    const newFotos = fotos.filter((_, idx) => idx !== indexToRemove)
    setFotos(newFotos)
    onChange(newFotos)
  }

  const moveFoto = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === fotos.length - 1) return

    const newFotos = [...fotos]
    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newFotos[index]
    newFotos[index] = newFotos[swapIndex]
    newFotos[swapIndex] = temp

    setFotos(newFotos)
    onChange(newFotos)
  }

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer relative ${
          dragActive ? 'border-teal-500 bg-teal-50' : 'border-gray-300 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 text-teal-600">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-medium">Subiendo fotos...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 text-gray-500">
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="font-medium text-gray-700">Arrastra tus fotos aquí o haz clic para subir</p>
            <p className="text-xs">Soporta JPG, PNG y WEBP</p>
          </div>
        )}
      </div>

      {fotos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {fotos.map((url, idx) => (
            <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-100 aspect-video">
              <img src={url} alt={`Foto ${idx+1}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <button 
                  type="button"
                  onClick={() => removeFoto(idx)}
                  className="self-end bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors shadow-sm"
                  title="Eliminar foto"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex justify-between items-center text-white">
                  <span className="text-xs font-bold bg-black/50 px-2 py-1 rounded">
                    {idx === 0 ? 'Principal' : `#${idx + 1}`}
                  </span>
                  <div className="flex gap-1">
                    {idx > 0 && (
                      <button type="button" onClick={() => moveFoto(idx, 'up')} className="bg-gray-800/80 p-1 rounded hover:bg-gray-700">
                        <GripVertical className="w-4 h-4 -rotate-90" />
                      </button>
                    )}
                    {idx < fotos.length - 1 && (
                      <button type="button" onClick={() => moveFoto(idx, 'down')} className="bg-gray-800/80 p-1 rounded hover:bg-gray-700">
                        <GripVertical className="w-4 h-4 rotate-90" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
