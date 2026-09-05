import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add preventDefault and stopPropagation
submit_pattern = r"const handleWhatsAppSubmit = async \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\)"
submit_replacement = r"const handleWhatsAppSubmit = async (e: React.FormEvent) => {\n    e.preventDefault()\n    e.stopPropagation()"
content = re.sub(submit_pattern, submit_replacement, content)

# 2. Replace useEffect with Debug version
old_effect = """  useEffect(() => {
    if (showSuccessBanner) {
      // Le damos un respiro para garantizar el renderizado del DOM
      const timer = setTimeout(() => {
        const banner = mensajeExitoRef.current || document.getElementById('banner-exito-reserva');
        
        if (banner) {
          // 1. Intento nativo estándar centrado
          banner.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // 2. Si el scroll está en un contenedor padre con overflow (típico en layouts Tailwind):
          let parent = banner.parentElement;
          while (parent) {
            const style = window.getComputedStyle(parent);
            const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight;
            if (isScrollable) {
              parent.scrollTo({ top: parent.scrollHeight, behavior: 'smooth' });
              break;
            }
            parent = parent.parentElement;
          }

          // 3. Respaldo por si el scroll sí fuera de la ventana/documento
          window.scrollTo({
            top: document.documentElement.scrollHeight || document.body.scrollHeight,
            behavior: 'smooth'
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);"""

new_effect = """  useEffect(() => {
    console.log('>>> [DEBUG SCROLL] showSuccessBanner cambió a:', showSuccessBanner);
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        const banner = document.getElementById('banner-exito-reserva');
        console.log('>>> [DEBUG SCROLL] Elemento banner encontrado:', banner);
        if (!banner) {
          console.warn('>>> [DEBUG SCROLL] El elemento NO existe en el DOM todavía.');
          return;
        }

        // Forzar scroll en documentElement, body y window
        console.log('>>> [DEBUG SCROLL] Ejecutando scrollIntoView...');
        banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner]);"""

content = content.replace(old_effect, new_effect)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
