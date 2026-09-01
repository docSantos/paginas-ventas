import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Nuevas Solicitudes Email
old_solicitud_phone = r"<span>📞 \{formatPhoneNumber\(solicitud\.telefono\)\}</span>"
new_solicitud_phone = """<span>📞 {formatPhoneNumber(solicitud.telefono)}</span>
                      {((solicitud as any).email || (solicitud as any).email_cliente) && (
                        <a href={`mailto:${(solicitud as any).email || (solicitud as any).email_cliente}`} className="hover:text-teal-600 transition-colors flex items-center gap-1">
                          ✉️ {(solicitud as any).email || (solicitud as any).email_cliente}
                        </a>
                      )}"""
content = re.sub(old_solicitud_phone, new_solicitud_phone, content)

# 2. Update Detalles del Cliente Email
# {r.email && <span className="text-sm text-gray-800 block mb-1">✉️ {r.email}</span>}
# (handle potential regex decoding issues by matching broadly)
old_r_email = r"\{r\.email && <span className=\"text-sm text-gray-800 block mb-1\">.*?\{r\.email\}</span>\}"
new_r_email = """{r.email && (
                              <a href={`mailto:${r.email}`} className="text-sm text-gray-800 block mb-1 hover:text-teal-600 transition-colors">
                                ✉️ {r.email}
                              </a>
                            )}"""
content = re.sub(old_r_email, new_r_email, content)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
