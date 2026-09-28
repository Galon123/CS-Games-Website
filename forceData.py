import re

with open('components/BadmintonBracketSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Disable Supabase fetching by wrapping it in `if (false)`
content = content.replace(
    'if (isSupabaseConfigured() && supabase) {',
    'if (false) {'
)

# Disable localStorage fetching by wrapping it in `if (false)`
content = content.replace(
    'const saved = localStorage.getItem(BADMINTON_STORAGE_KEY)',
    'const saved = null // Disabled for now to force hardcoded data update'
)

with open('components/BadmintonBracketSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
