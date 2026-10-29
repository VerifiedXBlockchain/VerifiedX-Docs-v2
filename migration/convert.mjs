// First-pass conversion of one v1 (Docusaurus) page into this site.
//   node migration/convert.mjs <v1-docs-dir> <old-id>   e.g. node migration/convert.mjs /tmp/v1/docs core/validator-guide
// Mechanical steps only: title/order frontmatter, sidebar color class, link targets through slug-map.json, media paths.
// Everything that needs judgement (Tabs, JSX, raw HTML, admonitions, descriptions) is left for the migrating agent;
// the report printed at the end lists what it found.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const slugMap = JSON.parse(readFileSync(join(ROOT, 'migration/slug-map.json'), 'utf8'));
const [v1Docs, oldId] = process.argv.slice(2);
if (!v1Docs || !oldId) throw new Error('usage: convert.mjs <v1-docs-dir> <old-id>');
const newSlug = slugMap[oldId];
if (!newSlug) throw new Error(`${oldId} is not in migration/slug-map.json`);

const sourcePath = ['.md', '.mdx'].map((ext) => join(v1Docs, oldId + ext)).find(existsSync);
if (!sourcePath) throw new Error(`no source file for ${oldId} in ${v1Docs}`);
let text = readFileSync(sourcePath, 'utf8');
const report = [];

// --- frontmatter
let frontmatter = {};
const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
if (fm) {
	for (const line of fm[1].split('\n')) {
		const m = line.match(/^([a-z_]+):\s*(.*)$/);
		if (m) frontmatter[m[1]] = m[2].trim();
	}
	text = text.slice(fm[0].length);
}
const h1 = text.match(/^\s*# (.+)\n/);
if (!h1) report.push('NO H1: set title by hand');
const title = h1 ? h1[1].trim() : oldId.split('/').pop();
if (h1) text = text.replace(h1[0], '\n');

// --- links: v1 doc links -> new absolute slugs
const oldDir = posix.dirname(oldId);
function resolveOldId(target) {
	let path = target;
	if (path.startsWith('/docs/')) path = path.slice('/docs/'.length);
	else if (path.startsWith('/docs')) path = path.slice('/docs'.length);
	else path = posix.join(oldDir, path);
	path = path.replace(/^\/+|\/+$/g, '').replace(/\.mdx?$/, '');
	if (slugMap[path]) return path;
	const asFolderIndex = `${path}/${posix.basename(path)}`;
	if (slugMap[asFolderIndex]) return asFolderIndex;
	return null;
}
const unresolved = new Set();
text = text.replace(/\]\(([^)\s]+)\)/g, (match, href) => {
	if (/^(https?:|mailto:|#|pathname:)/.test(href)) return match;
	const [target, hash] = href.split('#');
	if (!target) return match;
	if (/^\/(documents|network-assets|img)\//.test(target)) return match; // static files, kept at the same public path
	if (/\.(png|jpe?g|gif|svg|webp|pdf)$/i.test(target)) return match; // media, handled below
	const id = resolveOldId(target);
	if (!id) {
		unresolved.add(href);
		return match;
	}
	return `](/${slugMap[id]}/${hash ? `#${hash}` : ''})`;
});
for (const href of unresolved) report.push(`UNRESOLVED LINK: ${href}`);

// --- media: ./media/x.png (relative to the v1 file) -> src/assets/media/<v1 section>/x.png, relative to the new file
const newFile = join(ROOT, 'src/content/docs', `${newSlug}.md`);
function mediaPath(target) {
	const abs = posix.normalize(posix.join(oldDir, target));
	const parts = abs.split('/');
	const i = parts.indexOf('media');
	if (i < 1) return null;
	const asset = join(ROOT, 'src/assets/media', parts[0], ...parts.slice(i + 1));
	if (!existsSync(asset)) {
		report.push(`MISSING MEDIA: ${target}`);
		return null;
	}
	return relative(dirname(newFile), asset).split('\\').join('/');
}
text = text.replace(/(!\[[^\]]*\]\()([^)\s]+)(\))/g, (match, a, target, b) => {
	if (/^https?:/.test(target)) return match;
	const p = mediaPath(target);
	return p ? `${a}${p}${b}` : match;
});
text = text.replace(/require\(['"]([^'"]+)['"]\)(\.default)?/g, (match, target) => {
	const p = mediaPath(target);
	report.push(`REQUIRE IMAGE (${target}): convert to an astro:assets <Image> in .mdx or a markdown image -> ${p}`);
	return match;
});

// --- findings that need the agent
const checks = [
	[/@theme\/(Tabs|TabItem)|<Tabs|<TabItem/, 'TABS: convert to Starlight <Tabs syncKey="lang"> / <TabItem label="..."> in .mdx'],
	[/^import |^export /m, 'IMPORTS/EXPORTS: remove or replace with Starlight/Astro equivalents'],
	[/className=|style=\{\{/, 'JSX ATTRIBUTES: className/style objects; convert'],
	[/<iframe[^>]*youtube/i, 'YOUTUBE EMBED: remove (Tyler 2026-10-26: no YouTube embeds)'],
	[/^:::(warning|info|danger|caution|note|tip)/m, 'ADMONITIONS: map :::warning -> :::caution, :::info -> :::note; :::danger/:::caution/:::note/:::tip stay'],
	[/<details|<summary/, 'DETAILS: keep as HTML <details>, check it renders'],
];
for (const [re, message] of checks) if (re.test(text)) report.push(message);

// --- write
const fmLines = [`title: ${JSON.stringify(title)}`];
if (frontmatter.sidebar_label) report.push(`SIDEBAR LABEL in v1: ${frontmatter.sidebar_label}`);
const sidebar = [];
if (frontmatter.sidebar_label) sidebar.push(`  label: ${JSON.stringify(frontmatter.sidebar_label.replace(/^["']|["']$/g, ''))}`);
if (frontmatter.sidebar_position) sidebar.push(`  order: ${Number(frontmatter.sidebar_position)}`);
if (frontmatter.sidebar_class_name) sidebar.push(`  attrs:\n    class: ${frontmatter.sidebar_class_name}`);
if (sidebar.length) fmLines.push('sidebar:', ...sidebar);
const output = `---\n${fmLines.join('\n')}\n---\n${text.replace(/^\n+/, '\n')}`;
mkdirSync(dirname(newFile), { recursive: true });
writeFileSync(newFile, output.trimEnd() + '\n');
console.log(`${oldId} -> src/content/docs/${newSlug}.md`);
for (const line of report) console.log(`  ${line}`);
