import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the phone row in "Nuevas Solicitudes"
old_solicitud_phone = r"<span>📞 \{formatPhoneNumber\(solicitud\.telefono\)\}</span>"
new_solicitud_phone = """<span>📞 {formatPhoneNumber(solicitud.telefono)}</span>
                      {((solicitud as any).email || (solicitud as any).email_cliente) && (
                        <a href={`mailto:${(solicitud as any).email || (solicitud as any).email_cliente}`} className="hover:text-blue-600 transition-colors">
                          ✉️ {(solicitud as any).email || (solicitud as any).email_cliente}
                        </a>
                      )}"""

content = re.sub(old_solicitud_phone, new_solicitud_phone, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
