import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace sm: with md: for the positioning classes
old_classes = "fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-8 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4"
new_classes = "fixed bottom-20 md:bottom-8 left-4 right-4 md:left-auto md:right-8 z-[60] bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-slate-700 animate-in fade-in slide-in-from-bottom-4"

content = content.replace(old_classes, new_classes)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
