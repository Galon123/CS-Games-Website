import sys

with open('components/ChessView.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    new_lines.append(line)
    if '{/* Category Toggle (Badminton Style) */}' in line:
        # Check if the previous lines have 3 closing divs
        prev_lines = lines[max(0, i-4):i]
        div_count = sum(1 for pl in prev_lines if '</div>' in pl)
        if div_count < 3:
            # Inject a closing div just before this line
            new_lines.insert(-1, '          </div>\n')

with open('components/ChessView.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

# Now fix CarromBracketSection.tsx syntax
with open('components/CarromBracketSection.tsx', 'r', encoding='utf-8') as f:
    lines2 = f.readlines()

# The error was "Expected corresponding JSX closing tag for 'section'."
# Let's count divs.
# To be safe, let's just restore CarromBracketSection.tsx from git, and do the fix properly.
