// Translation bookkeeping. Each translated page records the hash of the English file it was translated from.
//   node scripts/translations.mjs check          list missing and stale translations; exits 1 if any are stale
//   node scripts/translations.mjs stamp <file>   record the current English hash on a translated file after (re)translating it
import { readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { ROOT, CONTENT_DIR, LOCALES, listContentFiles, englishSourceFor, sourceHash, readSourceHash } from './lib/content.mjs';

const [command, target] = process.argv.slice(2);

function check() {
	const files = listContentFiles();
	const english = files.filter((f) => !englishSourceFor(f));
	const stale = [];
	const missing = [];
	for (const locale of LOCALES) {
		for (const source of english) {
			const translated = join(CONTENT_DIR, locale, relative(CONTENT_DIR, source));
			if (!files.includes(translated)) missing.push(translated);
			else if (readSourceHash(translated) !== sourceHash(source)) stale.push(translated);
		}
	}
	for (const f of missing) console.log(`missing  ${f}`);
	for (const f of stale) console.log(`stale    ${f}`);
	console.log(`${stale.length} stale, ${missing.length} missing`);
	if (stale.length) process.exitCode = 1;
}

function stamp(file) {
	if (!file) throw new Error('usage: translations.mjs stamp <translated file>');
	const rel = relative(ROOT, join(ROOT, file));
	const source = englishSourceFor(rel);
	if (!source) throw new Error(`${rel} is not a translated file`);
	const hash = sourceHash(source);
	const text = readFileSync(join(ROOT, rel), 'utf8');
	if (!text.startsWith('---\n')) throw new Error(`${rel} has no frontmatter`);
	const updated = readSourceHash(rel)
		? text.replace(/^sourceHash:.*$/m, `sourceHash: ${hash}`)
		: text.replace(/^---\n/, `---\nsourceHash: ${hash}\n`);
	writeFileSync(join(ROOT, rel), updated);
	console.log(`${rel} <- ${source} (${hash})`);
}

if (command === 'check') check();
else if (command === 'stamp') stamp(target);
else {
	console.error('usage: translations.mjs check | stamp <file>');
	process.exitCode = 2;
}
