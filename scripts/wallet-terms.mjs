// Writes translation/wallet-terms.tsv: the SwitchBlade wallet's UI strings as English<TAB>Spanish pairs, so Spanish pages
// name buttons and screens exactly as the Spanish wallet shows them.
//   node scripts/wallet-terms.mjs <path to a VerifiedX-GUI checkout>
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './lib/content.mjs';

const MAX_LENGTH = 90; // longer strings are sentences, not terms

const guiRepo = process.argv[2];
if (!guiRepo) throw new Error('usage: wallet-terms.mjs <path to VerifiedX-GUI>');
const readArb = (locale) => JSON.parse(readFileSync(join(guiRepo, 'lib/l10n', `app_${locale}.arb`), 'utf8'));
const english = readArb('en');
const spanish = readArb('es');
const clean = (value) => value.replace(/\s+/g, ' ').trim();

const seen = new Set();
const rows = [];
for (const [key, value] of Object.entries(english)) {
	if (key.startsWith('@') || typeof value !== 'string' || typeof spanish[key] !== 'string') continue;
	const en = clean(value);
	const es = clean(spanish[key]);
	if (!en || en.length > MAX_LENGTH || seen.has(en.toLowerCase())) continue;
	seen.add(en.toLowerCase());
	rows.push(`${en}\t${es}`);
}
rows.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

const header = `# SwitchBlade wallet UI strings, English<TAB>Spanish, from VerifiedX-GUI lib/l10n/app_{en,es}.arb (strings up to ${MAX_LENGTH} characters). Regenerate with: node scripts/wallet-terms.mjs <path to VerifiedX-GUI>`;
writeFileSync(join(ROOT, 'translation/wallet-terms.tsv'), `${header}\n${rows.join('\n')}\n`);
console.log(`translation/wallet-terms.tsv: ${rows.length} strings`);
