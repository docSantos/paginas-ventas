import re

with open('src/components/casasgaby/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

pattern = r"""          <Link
            href="/casasgaby/admin"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick=\{\(\) => setMenuOpen\(false\)\}
          >
            .*? Panel Admin
          </Link>"""

replacement = """          <Link
            href="/casasgaby/admin"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            ⚙️ Panel Admin
          </Link>
          <Link
            href="/casasgaby/admin/operacion"
            className="block py-2 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            📋 Operación In-House
          </Link>"""

content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('src/components/casasgaby/Header.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
