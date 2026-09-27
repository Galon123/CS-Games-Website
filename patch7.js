const fs = require('fs');

let layout = fs.readFileSync('app/layout.tsx', 'utf8');

if (!layout.includes('const dmSans')) {
  layout = layout.replace(
    /const anton = Anton\(\{[\s\S]*?\}\)/,
    `const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dmsans',
})`
  );
  fs.writeFileSync('app/layout.tsx', layout);
}
