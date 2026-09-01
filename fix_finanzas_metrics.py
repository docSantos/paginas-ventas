import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_helper = """    // Helper to calculate lost revenue for a date range
    const getLostRevenue = (startBound: Date, endBound: Date) => {
      let lost = 0
      propiedades.forEach(prop => {
        const dailyRate = prop.precio_por_noche || 0
        if (!dailyRate) return

        let daysInBound = Math.round((endBound.getTime() - startBound.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Find overlapping reservations
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
        })
        
        const freeDays = Math.max(0, daysInBound - bookedDays)
        lost += (freeDays * dailyRate)
      })
      return lost
    }

    // Past months: Jan 1 to end of last month
    if (currentMonth > 0) {
      totalPast = getLostRevenue(startOfYear, new Date(currentYear, currentMonth, 0))
    }
    
    // Current month: Start of this month to end of this month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
    totalCurrent = getLostRevenue(startOfCurrentMonth, endOfCurrentMonth)

    // Future months: Start of next month to Dec 31
    if (currentMonth < 11) {
      const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
      totalFuture = getLostRevenue(startOfNextMonth, endOfYear)
    }

    const totalYearLost = totalPast + totalCurrent + totalFuture"""

new_helper = """    let freeNightsCurrent = 0
    let freeNightsFuture = 0

    // Helper to calculate lost revenue and free nights for a date range
    const getLostRevenue = (startBound: Date, endBound: Date) => {
      let lost = 0
      let totalFreeDays = 0
      propiedades.forEach(prop => {
        const dailyRate = prop.precio_por_noche || 0
        if (!dailyRate) return

        let daysInBound = Math.round((endBound.getTime() - startBound.getTime()) / (1000 * 60 * 60 * 24)) + 1
        
        // Find overlapping reservations
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
        })
        
        const freeDays = Math.max(0, daysInBound - bookedDays)
        lost += (freeDays * dailyRate)
        totalFreeDays += freeDays
      })
      return { lost, freeDays: totalFreeDays }
    }

    // Past months: Jan 1 to end of last month
    if (currentMonth > 0) {
      totalPast = getLostRevenue(startOfYear, new Date(currentYear, currentMonth, 0)).lost
    }
    
    // Current month: Start of this month to end of this month
    const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)
    totalCurrent = getLostRevenue(startOfCurrentMonth, endOfCurrentMonth).lost
    
    // For free nights specifically from TODAY to end of current month
    // Set 'today' to midnight to be consistent with date bounds
    const todayMidnight = new Date(currentYear, currentMonth, today.getDate())
    if (todayMidnight <= endOfCurrentMonth) {
      freeNightsCurrent = getLostRevenue(todayMidnight, endOfCurrentMonth).freeDays
    }

    // Future months: Start of next month to Dec 31
    if (currentMonth < 11) {
      const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1)
      const futureData = getLostRevenue(startOfNextMonth, endOfYear)
      totalFuture = futureData.lost
      freeNightsFuture = futureData.freeDays
    }

    const totalYearLost = totalPast + totalCurrent + totalFuture"""

content = content.replace(old_helper, new_helper)

# Also need to return freeNightsCurrent and freeNightsFuture from useMemo
old_return = "return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows }"
new_return = "return { totalPast, totalCurrent, totalFuture, totalYearLost, propertyRows, freeNightsCurrent, freeNightsFuture }"

content = content.replace(old_return, new_return)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
