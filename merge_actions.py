import re

actions_file = 'src/app/casasgaby/admin/actions.ts'
sprint77_file = 'src/app/casasgaby/admin/actions_sprint77.ts'

with open(actions_file, 'r', encoding='utf8') as f:
    content = f.read()

with open(sprint77_file, 'r', encoding='utf8') as f:
    new_actions = f.read()

# Check if already added
if 'reprogramarFechasReserva' in content:
    print("Already added!")
else:
    # Append to main actions file
    content = content.rstrip() + '\n\n' + new_actions + '\n'
    with open(actions_file, 'w', encoding='utf8') as f:
        f.write(content)
    print("Actions appended successfully!")
