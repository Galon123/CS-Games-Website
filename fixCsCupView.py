import re

with open('components/CsCupView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove the bad </div> right before </main>
content = re.sub(r'\s*</div>\n\s*</main>', '\n      </main>', content)

# 2. Add the wrapper inside <main>
# The main tag is: <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
# We want to insert the wrapper right after it, and close it right before </main>

main_tag = '<main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">'
if main_tag in content:
    replacement = main_tag + '\n        <div className="bg-ink-950/60 backdrop-blur-md rounded-3xl p-4 sm:p-6 md:p-10 border border-white/10 shadow-2xl relative z-10">'
    content = content.replace(main_tag, replacement)
    
    # Now close it before </main>
    content = content.replace('</main>', '  </div>\n      </main>')
else:
    print("Could not find main tag!")

with open('components/CsCupView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
