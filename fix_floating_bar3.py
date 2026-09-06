import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# I will find the class string using a regex that matches `className="fixed...bg-slate-900..."`
pattern = re.compile(r'className="fixed [^"]*bg-slate-900[^"]*"')
new_classes = 'className="fixed left-1/2 -translate-x-1/2 bottom-[110px] z-[60] w-[90%] max-w-md bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-4"'

content = pattern.sub(new_classes, content)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
