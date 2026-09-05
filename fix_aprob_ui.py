import re

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_aprob = """        await aprobarSolicitud(
          aprobarModal.solicitud.id,
          baseCalculada,
          parseFloat(montoAnticipo || '0'),
          metodoPago,
          moneda,
          parseFloat(tc || '1'),
          extrasPayload
        )
      setAprobarModal({ open: false, solicitud: null })
    } catch (e: any) {"""

new_aprob = """        const res = await aprobarSolicitud(
          aprobarModal.solicitud.id,
          baseCalculada,
          parseFloat(montoAnticipo || '0'),
          metodoPago,
          moneda,
          parseFloat(tc || '1'),
          extrasPayload
        )
        if (res && !res.success) {
          alert("No es posible aprobar esta solicitud: " + (res.message || res.error || "Ocurrió un error."));
          return;
        }
      setAprobarModal({ open: false, solicitud: null })
    } catch (e: any) {"""

content = content.replace(old_aprob, new_aprob)

with open('src/components/casasgaby/admin/ReservasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
