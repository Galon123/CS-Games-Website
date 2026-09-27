import re

with open('components/EsportsView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# The new ESPORTS_EVENTS array
new_events = """const ESPORTS_EVENTS: EsportsEvent[] = [
  {
    id: 'efootball',
    name: 'E-Football',
    type: '1v1 Knockout',
    image: '/posters/EFOOTBALL.jpg',
    description: `Think you’ve got the best tactics on eFootball? Prove it! 🎮⚽

The CSE Department presents CS Games: eFootball Tournament. Show off your skills, outsmart your rivals, and claim the ultimate bragging rights (and the prize pool)!

💰Prize Pool: ₹1,000
Registration Fee: ₹25

Eligibility: Open to all departments!`,
    registrationLink: 'https://forms.gle/SLbEvsmQwcKZDBDB9'
  },
  {
    id: 'minimilitia',
    name: 'Mini Militia',
    type: 'Free-for-all',
    image: '/posters/MINI MILITIA.jpg',
    description: `Lock, load and gear up! 💣🔫

The Department of Computer Science and Engineering brings back the ultimate local multiplayer battlefield with the Mini Militia Tournament! Grab your weapons, dodge the bombs, and outgun the competition to claim victory.

👤 Format: Solo
🎁 Prizes Worth: ₹500
🎟️ Registration Fee: ₹20/-
🌐 Eligibility: Open to all departments
📞 Contact: Ashwin D Sreenivas – 94472 04941`,
    registrationLink: 'https://forms.gle/Lr3qSSceKs99PVf97'
  }
]"""

# Replace the array
content = re.sub(r'const ESPORTS_EVENTS: EsportsEvent\[\] = \[.*?\]\s*\]', new_events, content, flags=re.DOTALL)

# Add whitespace-pre-wrap to the description paragraph
content = content.replace('className="text-sm text-mist leading-relaxed font-sans"', 'className="text-sm text-mist leading-relaxed font-sans whitespace-pre-wrap"')

with open('components/EsportsView.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
