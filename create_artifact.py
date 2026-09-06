import re
import os

with open(r'C:\Users\PcKon\Documents\paginas-ventas\plan_maestro_original.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract just the IMPLEMENTATION_PLAN.md part
match = re.search(r'# IMPLEMENTATION_PLAN\.md\n(.*?)<\/USER_REQUEST>', content, re.DOTALL)
if match:
    plan = match.group(1).strip()
    
    artifact_path = r'C:\Users\PcKon\.gemini\antigravity\brain\ac4725a2-f387-4976-b0da-b517c7d78972\plan_maestro_original.md'
    with open(artifact_path, 'w', encoding='utf-8') as out:
        out.write("# Plan Maestro Original (Visin del Proyecto)\n\n" + plan)
    print("Artifact created.")
else:
    print("Match failed.")
