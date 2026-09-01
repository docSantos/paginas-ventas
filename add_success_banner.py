import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add X to lucide imports
content = content.replace("Send, MapPin } from", "Send, MapPin, X } from")

# Add state
content = content.replace(
    "const [isSubmitting, setIsSubmitting] = useState(false)",
    "const [isSubmitting, setIsSubmitting] = useState(false)\n  const [showSuccessBanner, setShowSuccessBanner] = useState(false)"
)

# Update submit handler
old_submit = """      } catch (err) {
        alert('Error al procesar la solicitud')
      } finally {
        setIsSubmitting(false)
      }"""
new_submit = """        setShowSuccessBanner(true)
      } catch (err) {
        alert('Error al procesar la solicitud')
      } finally {
        setIsSubmitting(false)
      }"""
content = content.replace(old_submit, new_submit)

# Add banner JSX
old_banner_placement = """        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0"""

new_banner_placement = """        </div>

        {showSuccessBanner && (
          <div className="w-full mt-4 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg p-4 shadow-sm relative flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                ¡Tu solicitud ha sido enviada con éxito! Nos pondremos en contacto contigo a la brevedad para confirmar los detalles.
              </p>
            </div>
            <button 
              onClick={() => setShowSuccessBanner(false)}
              className="text-emerald-700 hover:text-emerald-900 p-1 -mr-2 -mt-2 rounded-md hover:bg-emerald-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0"""
content = content.replace(old_banner_placement, new_banner_placement)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
