const fs = require('fs');
let c = fs.readFileSync('app/layout.tsx', 'utf8');
c = c.replace(
`import type { Metadata } from 'next'
import './globals.css'`,
`import type { Metadata } from 'next'
import { Anton } from 'next/font/google'
import './globals.css'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})`
);
c = c.replace(
`<html lang="en" className="dark" suppressHydrationWarning>`,
`<html lang="en" className={\`dark \${anton.variable}\`} suppressHydrationWarning>`
);
fs.writeFileSync('app/layout.tsx', c);
