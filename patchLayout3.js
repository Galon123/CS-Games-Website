const fs = require('fs');
let c = fs.readFileSync('app/layout.tsx', 'utf8');
c = c.replace(
`import type { Metadata } from 'next'`,
`import type { Metadata } from 'next'
import { Anton } from 'next/font/google'

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
})`
);
fs.writeFileSync('app/layout.tsx', c);
