import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

find_text = 'alert("Por favor corrige las fechas antes de continuar")'
replace_text = 'alert("Las fechas seleccionadas no están disponibles. Por favor consulta el recuadro de \'Fechas ocupadas\' y elige otro período.")'

content = content.replace(find_text, replace_text)

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
