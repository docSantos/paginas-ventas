import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add the ID to the banner div
banner_pattern = r'(<div\s+ref=\{mensajeExitoRef\}\s+className="w-full mt-4 mb-28 bg-emerald-50)'
replacement_banner = r'<div id="banner-exito-reserva" ref={mensajeExitoRef} className="w-full mt-4 mb-28 bg-emerald-50'

content = re.sub(banner_pattern, replacement_banner, content)


# 2. Replace the useEffect block
old_effect = """  useEffect(() => {
    if (showSuccessBanner) {
      const timer = setTimeout(() => {
        if (mensajeExitoRef.current) {
          mensajeExitoRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        } else {
          // Fallback en caso de que el ref no esté montado o el layout use scroll de ventana
          window.scrollTo({
            top: document.documentElement.scrollHeight || document.body.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [showSuccessBanner])"""

new_effect = """  useEffect(() => {
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

content = content.replace(old_effect, new_effect)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
