import re

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Fix the import to include Coins
content = re.sub(
    r'(import \{.*?)(\} from \'lucide-react\')',
    r'\1, Coins \2',
    content
)

# 2. Fix the button rendering
old_btn_str = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4 mr-2 inline" /> : <Banknote className="w-4 h-4 mr-2 inline" />} {m}
                      </button>"""

new_btn_str = """                      <button
                        key={m}
                        onClick={() => setConfMetodo(m)}
                        className={`flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm rounded-lg border font-medium transition-colors ${confMetodo === m ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-300 hover:border-teal-400'}`}
                      >
                        {m === 'Transferencia' ? <ArrowRightLeft className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                        <span>{m}</span>
                      </button>"""

content = content.replace(old_btn_str, new_btn_str)

with open('src/components/casasgaby/admin/ClientesClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
