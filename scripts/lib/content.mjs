// Shared helpers for content files: slugs, locales, and translation source hashes.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));
export const CONTENT_DIR = 'src/content/docs';
// Non-root locales; English lives at the content root.
export const LOCALES = ['es'];

const CONTENT_PATH = join(ROOT, CONTENT_DIR);

export function listContentFiles(dir = CONTENT_PATH) {
	return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) return listContentFiles(full);
		return /\.mdx?$/.test(entry.name) ? [relative(ROOT, full)] : [];
	});
}

// "src/content/docs/es/learn/vbtc.md" -> "es/learn/vbtc"; "src/content/docs/index.mdx" -> ""
export function fileToSlug(file) {
	return relative(CONTENT_DIR, file)
		.replace(/\.mdx?$/, '')
		.replace(/(^|\/)index$/, '')
		.toLowerCase();
}

// For a translated file, the English file it was translated from; null for English files.
export function englishSourceFor(file) {
	const rel = relative(CONTENT_DIR, file);
	const locale = LOCALES.find((l) => rel.startsWith(`${l}/`));
	if (!locale) return null;
	const base = join(CONTENT_DIR, rel.slice(locale.length + 1)).replace(/\.mdx?$/, '');
	const match = ['.md', '.mdx'].map((ext) => base + ext).find((f) => existsSync(join(ROOT, f)));
	if (!match) throw new Error(`${file} has no English source at ${base}.md(x)`);
	return match;
}

export function sourceHash(file) {
	return createHash('sha256').update(readFileSync(join(ROOT, file))).digest('hex').slice(0, 12);
}

export function readSourceHash(file) {
	const match = readFileSync(join(ROOT, file), 'utf8').match(/^---\n[\s\S]*?^sourceHash:\s*["']?([0-9a-f]+)["']?\s*$/m);
	return match ? match[1] : null;
}
