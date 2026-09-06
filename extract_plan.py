import json

with open(r'C:\Users\PcKon\.gemini\antigravity\brain\ac4725a2-f387-4976-b0da-b517c7d78972\.system_generated\logs\transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('type') == 'USER_INPUT' and 'IMPLEMENTATION_PLAN.md' in obj.get('content', ''):
            content = obj['content']
            with open(r'C:\Users\PcKon\Documents\paginas-ventas\plan_maestro_original.md', 'w', encoding='utf-8') as out:
                out.write(content)
            print("Extracted successfully.")
            break
