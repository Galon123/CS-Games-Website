with open('components/EsportsView.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Using split to replace the exact block
start_marker = "const ESPORTS_EVENTS: EsportsEvent[] = ["
end_marker = "]\n\nexport default function EsportsView()"

if start_marker in content and end_marker in content:
    before = content.split(start_marker)[0]
    after = content.split(end_marker)[1]

    new_events = start_marker + """
  {
    id: 'efootball',
    name: 'E-Football',
    type: '1v1 Knockout',
    image: '/posters/EFOOTBALL.jpg',
    description: `Think you’ve got the best tactics on eFootball? Prove it! 🎮⚽\\n\\nThe CSE Department presents CS Games: eFootball Tournament. Show off your skills, outsmart your rivals, and claim the ultimate bragging rights (and the prize pool)!\\n\\n💰Prize Pool: ₹1,000\\nRegistration Fee: ₹25\\n\\nEligibility: Open to all departments!`,
    registrationLink: 'https://forms.gle/SLbEvsmQwcKZDBDB9'
  },
  {
    id: 'minimilitia',
    name: 'Mini Militia',
    type: 'Free-for-all',
    image: '/posters/MINI MILITIA.jpg',
    description: `Lock, load and gear up! 💣🔫\\n\\nThe Department of Computer Science and Engineering brings back the ultimate local multiplayer battlefield with the Mini Militia Tournament! Grab your weapons, dodge the bombs, and outgun the competition to claim victory.\\n\\n👤 Format: Solo\\n🎁 Prizes Worth: ₹500\\n🎟️ Registration Fee: ₹20/-\\n🌐 Eligibility: Open to all departments\\n📞 Contact: Ashwin D Sreenivas – 94472 04941`,
    registrationLink: 'https://forms.gle/Lr3qSSceKs99PVf97'
  }
""" + end_marker

    content = before + new_events + after

    content = content.replace('className="text-sm text-mist leading-relaxed font-sans"', 'className="text-sm text-mist leading-relaxed font-sans whitespace-pre-wrap"')

    with open('components/EsportsView.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
else:
    print("Could not find markers")
