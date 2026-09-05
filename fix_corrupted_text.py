import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Revert accidental replacements of "da" to "día"
    content = content.replace("Propiedíad", "Propiedad")
    content = content.replace("propiedíad", "propiedad")
    content = content.replace("fecha_entradía", "fecha_entrada")
    content = content.replace("fecha_salidía", "fecha_salida")
    content = content.replace("amenidíad", "amenidad")
    content = content.replace("cantidíad", "cantidad")
    content = content.replace("todía", "toda")
    content = content.replace("nadía", "nada")
    content = content.replace("dían", "dan")
    content = content.replace("cadía", "cada")
    content = content.replace("guardíad", "guardad")
    content = content.replace("ayudía", "ayuda")
    content = content.replace("edíad", "edad")

    # Fix implicit any type
    content = content.replace("(f, i) =>", "(f: string, i: number) =>")
    content = content.replace("amenidad =>", "(amenidad: string) =>")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/app/casasgaby/propiedad/[id]/page.tsx')
fix_file('src/components/casasgaby/PropertyDetailClient.tsx')
