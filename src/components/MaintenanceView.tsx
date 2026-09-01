import { Wrench } from 'lucide-react'

export function MaintenanceView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Wrench className="w-8 h-8 text-gray-400" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Sitio en mantenimiento</h1>
      <p className="text-gray-500 max-w-md">
        Estamos realizando mejoras en la plataforma. Por favor, regresa más tarde.
      </p>
    </div>
  )
}
