import re

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace getLostRevenue calculation
pattern1 = r"if \(rStart <= endBound && rEnd >= startBound\) \{\s*const overlapStart = rStart > startBound \? rStart : startBound\s*const overlapEnd = rEnd < endBound \? rEnd : endBound\s*bookedDays \+= Math\.round\(\(overlapEnd\.getTime\(\) - overlapStart\.getTime\(\)\) / \(1000 \* 60 \* 60 \* 24\)\) \+ 1\s*\}"

repl1 = """if (rStart <= endBound && rEnd > startBound) {
              const overlapStart = rStart > startBound ? rStart : startBound
              const rEndNight = new Date(rEnd)
              rEndNight.setDate(rEndNight.getDate() - 1)
              const overlapEnd = rEndNight < endBound ? rEndNight : endBound
              
              if (overlapEnd >= overlapStart) {
                bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
              }
            }"""

content = re.sub(pattern1, repl1, content)


# Replace detail table calculation
pattern2 = r"if \(rStart <= viewEnd && rEnd >= viewStart\) \{\s*const overlapStart = rStart > viewStart \? rStart : viewStart\s*const overlapEnd = rEnd < viewEnd \? rEnd : viewEnd\s*bookedDays \+= Math\.round\(\(overlapEnd\.getTime\(\) - overlapStart\.getTime\(\)\) / \(1000 \* 60 \* 60 \* 24\)\) \+ 1\s*\}"

repl2 = """if (rStart <= viewEnd && rEnd > viewStart) {
            const overlapStart = rStart > viewStart ? rStart : viewStart
            const rEndNight = new Date(rEnd)
            rEndNight.setDate(rEndNight.getDate() - 1)
            const overlapEnd = rEndNight < viewEnd ? rEndNight : viewEnd
            
            if (overlapEnd >= overlapStart) {
              bookedDays += Math.round((overlapEnd.getTime() - overlapStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
            }
          }"""

content = re.sub(pattern2, repl2, content)

with open('src/components/casasgaby/admin/FinanzasClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
