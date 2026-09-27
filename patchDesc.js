const fs = require('fs');

let eventsData = fs.readFileSync('lib/events-data.ts', 'utf8');
eventsData = eventsData.replace(/description: '.*',\n/g, '');
eventsData = eventsData.replace(/description\?: string/g, '');
fs.writeFileSync('lib/events-data.ts', eventsData);

let sepEvents = fs.readFileSync('components/SeptemberEvents.tsx', 'utf8');

// Remove description from state
sepEvents = sepEvents.replace(/const \[formDescription, setFormDescription\] = useState\(''\)/g, '');

// Remove description from setFormDescription
sepEvents = sepEvents.replace(/setFormDescription\(.*?\)/g, '');

// Remove from newEvt object
sepEvents = sepEvents.replace(/description: formDescription\.trim\(\) \|\| undefined,/g, '');

// Remove description from modal render
const modalDescRegex = /\{\/\* Description \*\/\}\s*\{activeEventModal\.description && \(\s*<p className="text-xs text-mist leading-relaxed font-sans bg-white\/\[0\.02\] p-4 rounded-xl border border-white\/5">\s*\{activeEventModal\.description\}\s*<\/p>\s*\)\}/g;
sepEvents = sepEvents.replace(modalDescRegex, '');

// Remove description from form
const formDescRegex = /<div>\s*<label className="text-\[11px\] font-mono text-fog block mb-1">\s*Description \/ Details\s*<\/label>\s*<textarea[\s\S]*?className="w-full bg-ink-800 border border-white\/15 rounded-xl px-3 py-2 text-xs text-paper focus:outline-none focus:border-acid"\s*\/>\s*<\/div>/g;
sepEvents = sepEvents.replace(formDescRegex, '');

fs.writeFileSync('components/SeptemberEvents.tsx', sepEvents);
