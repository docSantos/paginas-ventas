import re

with open('src/types/database.ts', 'r', encoding='utf-8') as f:
    content = f.read()

row_pattern = r"""(estado: 'Activa' \| 'Archivada'\s+created_at: string)"""
insert_pattern = r"""(estado\?: 'Activa' \| 'Archivada'\s+created_at\?: string)"""

fields = """
            solicitada_en: string | null
            confirmada_en: string | null
            check_in_real_at: string | null
            check_out_real_at: string | null"""

fields_optional = """
            solicitada_en?: string | null
            confirmada_en?: string | null
            check_in_real_at?: string | null
            check_out_real_at?: string | null"""

content = re.sub(row_pattern, r"\1" + fields, content)
content = re.sub(insert_pattern, r"\1" + fields_optional, content)

with open('src/types/database.ts', 'w', encoding='utf-8') as f:
    f.write(content)
