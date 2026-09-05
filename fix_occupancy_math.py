import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix getLostRevenue
old_getLostRevenue = """          // Find overlapping reservations
          let bookedDays = 0
          reservas.forEach(r => {
            if (r.propiedad_id !== prop.id) return
            const rStart = new Date(r.fecha_entrada + 'T12:00:00')
            const rEnd = new Date(r.fecha_salida + 'T12:00:00')
            
            if (rStart <= endBound && rEnd >= startBound) {
              const overlapStart = rStart > startBound ? rStart : startBound
              const overlapEnd = rEnd < endBound ? rEnd : endBound
              bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
            }
          })"""

new_getLostRevenue = """          // Find overlapping reservations
          let bookedDays = 0
          reservas.forEach(r => {
            if (r.propiedad_id !== prop.id) return
            if (r.estado === 'cancelada' || r.estado === 'Rechazada') return
            
            const rStart = new Date(r.fecha_entrada + 'T12:00:00')
            const rEnd = new Date(r.fecha_salida + 'T12:00:00')
            
            if (rStart <= endBound && rEnd > startBound) {
              const overlapStart = rStart > startBound ? rStart : startBound
              const rEndNight = new Date(rEnd)
              rEndNight.setDate(rEndNight.getDate() - 1)
              const overlapEnd = rEndNight < endBound ? rEndNight : endBound
              
              if (overlapEnd >= overlapStart) {
                bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
              }
            }
          })"""

content = content.replace(old_getLostRevenue, new_getLostRevenue)

# Fix detail table math
old_detailMath = """          // Occupancy stats (For Selected Month)
          const rStart = new Date(r.fecha_entrada + 'T12:00:00')
          const rEnd = new Date(r.fecha_salida + 'T12:00:00')
          
          if (rStart <= viewEnd && rEnd >= viewStart) {
            const overlapStart = rStart > viewStart ? rStart : viewStart
            const overlapEnd = rEnd < viewEnd ? rEnd : viewEnd
            bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
          }"""

new_detailMath = """          // Occupancy stats (For Selected Month)
          const rStart = new Date(r.fecha_entrada + 'T12:00:00')
          const rEnd = new Date(r.fecha_salida + 'T12:00:00')
          
          if (rStart <= viewEnd && rEnd > viewStart && r.estado !== 'cancelada' && r.estado !== 'Rechazada') {
            const overlapStart = rStart > viewStart ? rStart : viewStart
            const rEndNight = new Date(rEnd)
            rEndNight.setDate(rEndNight.getDate() - 1)
            const overlapEnd = rEndNight < viewEnd ? rEndNight : viewEnd
            
            if (overlapEnd >= overlapStart) {
              bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
            }
          }"""

content = content.replace(old_detailMath, new_detailMath)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
