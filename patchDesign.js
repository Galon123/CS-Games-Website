const fs = require('fs');
let design = fs.readFileSync('design.md', 'utf8');

// Replace Typography section
const oldTypoRegex = /## 3\. Typography[\s\S]*?(?=### 3\.2 Scale)/;
const newTypo = `## 3. Typography

The site utilizes a strictly controlled typographic system with three distinct font families, each serving a specific structural purpose. **No other fonts may be used.**

### 3.1 Families & roles

| Role | Token / Font | Where |
|---|---|---|
| **Section Headings / Nav** | \`Plus Jakarta Sans\` (\`font-grotesk\` or \`font-serif\`) | Lower case section headings (e.g. "upcoming fixtures", "meet the teams"), global navigation links, and the main navbar brand. |
| **All Other Headings** | \`Anton\` (\`font-anton\`) | Team names, text on banners, table column headers, and **all** headings across the Admin space. Rendered exclusively in UPPERCASE. |
| **Descriptions / Body** | \`DM Sans\` (\`font-sans\` or \`font-mono\`) | Body paragraphs, detailed descriptions, match statistics labels, and secondary reading text. |

`;
design = design.replace(oldTypoRegex, newTypo);

// Replace Token Reference section fonts
const oldTokensRegex = /\/\* type \*\/[\s\S]*?\/\* radii \*\//;
const newTokens = `/* type */
  --font-anton:"Anton", sans-serif;
  --font-jakarta:"Plus Jakarta Sans", sans-serif;
  --font-dmsans:"DM Sans", sans-serif;
  /* radii */`;
design = design.replace(oldTokensRegex, newTokens);

fs.writeFileSync('design.md', design);
