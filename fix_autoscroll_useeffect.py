import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
content = content.replace(
    "import { useState, useMemo, useRef } from 'react'",
    "import { useState, useMemo, useRef, useEffect } from 'react'"
)

# 2. Add useEffect block
use_effect_block = """  useEffect(() => {
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
  }, [showSuccessBanner])
"""

if "useEffect(() => {" not in content:
    # Insert it right after the ref definition
    content = content.replace(
        "const mensajeExitoRef = useRef<HTMLDivElement>(null)",
        "const mensajeExitoRef = useRef<HTMLDivElement>(null)\n\n" + use_effect_block
    )

# 3. Remove the setTimeout from handleWhatsAppSubmit
submit_pattern = r"setShowSuccessBanner\(true\)\s*setTimeout\(\(\) => \{\s*mensajeExitoRef\.current\?\.scrollIntoView\(\{\s*behavior: 'smooth',\s*block: 'center'\s*\}\);\s*\}, 100\)"
replacement_submit = r"setShowSuccessBanner(true)"

content = re.sub(submit_pattern, replacement_submit, content)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
