import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { useState, useMemo } from 'react'",
    "import { useState, useMemo, useRef } from 'react'"
)

# 2. Add useRef inside the component
if "const mensajeExitoRef =" not in content:
    content = content.replace(
        "const [errorFechas, setErrorFechas] = useState('')",
        "const [errorFechas, setErrorFechas] = useState('')\n  const mensajeExitoRef = useRef<HTMLDivElement>(null)"
    )

# 3. Add setTimeout in handleWhatsAppSubmit
submit_pattern = r"(setShowSuccessBanner\(true\)\s*\} catch \(err\) \{)"
replacement_submit = r"""setShowSuccessBanner(true)
        setTimeout(() => {
          mensajeExitoRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100)
      } catch (err) {"""

content = re.sub(submit_pattern, replacement_submit, content)

# 4. Attach ref and add mb-28 to the success banner
banner_pattern = r'(\{showSuccessBanner && \(\s*<div)\s+(className="w-full mt-4 bg-emerald-50)'
replacement_banner = r'\1 ref={mensajeExitoRef} className="w-full mt-4 mb-28 bg-emerald-50'

content = re.sub(banner_pattern, replacement_banner, content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
