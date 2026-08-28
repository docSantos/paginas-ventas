'use client'

import { MessageSquare } from 'lucide-react'
import { useState } from 'react'

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  // En la Fase 2 / 3, aquí se insertaría el iframe o script de n8n
  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 z-50 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all"
        aria-label="Abrir chat"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Ventana de chat simulada */}
      {isOpen && (
        <div className="fixed bottom-36 right-4 z-50 w-80 h-96 bg-white rounded-2xl shadow-xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-teal-600 text-white p-3 flex justify-between items-center">
            <span className="font-medium">Asistente Virtual Casas Gaby</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-teal-100">
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center text-center">
            <p className="text-sm text-gray-500">
              (Widget de Chatbot n8n se conectará aquí próximamente)
            </p>
          </div>
        </div>
      )}
    </>
  )
}
