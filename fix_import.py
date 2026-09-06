import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bad_block = """  import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const formatDateEs = (dateStr: string, withTime = false) => {
  if (!dateStr) return ''
  return format(parseISO(dateStr), withTime ? 'dd MMM yyyy HH:mm' : 'dd MMM yyyy', { locale: es })
}"""

content = content.replace(bad_block, "")

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
