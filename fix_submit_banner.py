import re

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("setIsModalOpen(false)\n    } catch (err) {", "setIsModalOpen(false)\n      setShowSuccessBanner(true)\n    } catch (err) {")

with open('src/components/casasgaby/PropertyDetailClient.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
