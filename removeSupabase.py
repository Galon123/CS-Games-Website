import re

with open('components/BadmintonBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Completely remove supabase fetch
content = re.sub(
    r'// If Supabase configured, attempt to fetch latest synced matches.*?// Initialize from hardcoded / local storage if no Supabase data found',
    '// Removed supabase fetch\n      // Initialize from hardcoded / local storage if no Supabase data found',
    content,
    flags=re.DOTALL
)

# Completely remove supabase save
content = re.sub(
    r'// Sync to Supabase if connected.*?\} catch \(err\) \{.*?\}.*?\}',
    '// Removed supabase save',
    content,
    flags=re.DOTALL
)

with open('components/BadmintonBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
