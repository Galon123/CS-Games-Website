const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');
layout = layout.replace(
  `import { Anton } from 'next/font/google'`,
  `import { Anton, DM_Sans, Plus_Jakarta_Sans } from 'next/font/google'`
);

layout = layout.replace(
  `const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})`,
  `const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
})`
);

layout = layout.replace(
  `className={\`dark \${anton.variable}\`}`,
  `className={\`dark \${anton.variable} \${dmSans.variable} \${plusJakarta.variable}\`}`
);

fs.writeFileSync('app/layout.tsx', layout);
