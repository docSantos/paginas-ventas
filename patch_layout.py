import re

with open('src/app/casasgaby/layout.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

imports = """import { createClient } from '@/lib/supabase/server';
import { MaintenanceView } from '@/components/MaintenanceView';"""

content = content.replace("import { ChatWidget } from \"@/components/casasgaby/ChatWidget\";", "import { ChatWidget } from \"@/components/casasgaby/ChatWidget\";\n" + imports)

layout_logic = """export default async function CasasGabyLayout({ children }: LayoutProps<"/casasgaby">) {
  const supabase = await createClient();
  const { data: tenant } = await supabase.from('tenants_config').select('activo').eq('id', 'casasgaby').maybeSingle();
  
  if (tenant && tenant.activo === false) {
    return (
      <div className="flex flex-col min-h-screen max-w-2xl mx-auto bg-white shadow-sm relative">
        <MaintenanceView />
      </div>
    );
  }

  return ("""

content = content.replace("export default function CasasGabyLayout({ children }: LayoutProps<\"/casasgaby\">) {\n  return (", layout_logic)

with open('src/app/casasgaby/layout.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
