// Checks migrated pages for leftovers from Docusaurus and for broken links/media, without running a full build.
//   node migration/lint.mjs <dir-or-file>...   e.g. node migration/lint.mjs src/content/docs/node
// Exits 1 when anything is found.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT = join(ROOT, 'src/content/docs');
const slugs = new Set(Object.values(JSON.parse(readFileSync(join(ROOT, 'migration/slug-map.json'), 'utf8'))));
const HTML_TAGS = new Set('a abbr b blockquote br code dd del details div dl dt em figcaption figure h1 h2 h3 h4 h5 h6 hr i iframe img ins kbd li ol p picture pre s source span strong sub summary sup table tbody td th thead tr u ul video'.split(' '));

const files = process.argv.slice(2).flatMap(function walk(p) {
	const abs = resolve(p);
	if (statSync(abs).isDirectory()) return readdirSync(abs).flatMap((name) => walk(join(abs, name)));
	return /\.mdx?$/.test(abs) ? [abs] : [];
});
if (!files.length) throw new Error('usage: lint.mjs <dir-or-file>...');

function pageExists(slug) {
	const base = join(CONTENT, slug);
	return ['.md', '.mdx', '/index.md', '/index.mdx'].some((ext) => existsSync(base + ext));
}

let problems = 0;
for (const file of files) {
	const text = readFileSync(file, 'utf8');
	const issues = [];
	const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
	if (!fm) issues.push('no frontmatter');
	else {
		if (!/^title:/m.test(fm[1])) issues.push('frontmatter: no title');
		if (!/^description:/m.test(fm[1])) issues.push('frontmatter: no description');
		for (const key of ['sidebar_position', 'sidebar_class_name', 'sidebar_label', 'slug:', 'id:']) if (fm[1].includes(key)) issues.push(`frontmatter: v1 key ${key}`);
	}
	const body = fm ? text.slice(fm[0].length) : text;
	// Strip fenced code and inline code before checking prose.
	const prose = body.replace(/^(```|~~~)[\s\S]*?^\1/gm, '').replace(/`[^`\n]*`/g, '');
	const isMdx = file.endsWith('.mdx');

	if (/^# /m.test(prose)) issues.push('body has an H1; the title comes from frontmatter');
	if (/@theme\/|require\(/.test(body)) issues.push('Docusaurus import or require()');
	if (/className=|style=\{\{/.test(body)) issues.push('JSX className/style object');
	if (/^:::(warning|info)\b/m.test(body)) issues.push(':::warning/:::info (use :::caution/:::note)');
	if (/^:::[a-z]+ \S/m.test(body)) issues.push('Docusaurus aside title (":::note Title" must be ":::note[Title]")');
	if (/<iframe[^>]*youtube/i.test(body)) issues.push('YouTube embed');
	if (!isMdx && /<(Tabs|TabItem|LinkButton|Image|Card)\b/.test(prose)) issues.push('component used in a .md file (rename to .mdx)');
	if (!isMdx) {
		const tags = [...prose.matchAll(/<([a-zA-Z][\w-]*)/g)].map((m) => m[1]).filter((t) => !HTML_TAGS.has(t.toLowerCase()));
		if (tags.length) issues.push(`unescaped <placeholder> in prose (renders as an invisible tag): ${[...new Set(tags)].map((t) => `<${t}`).join(', ')}`);
	}

	for (const m of body.matchAll(/\]\(([^)\s]+)\)/g)) {
		const href = m[1];
		if (/^(https?:|mailto:|#)/.test(href)) continue;
		const target = href.split('#')[0];
		if (/^\/docs\b/.test(target)) issues.push(`v1 link: ${href}`);
		else if (/^\/(documents|network-assets)\//.test(target)) {
			if (!existsSync(join(ROOT, 'public', decodeURIComponent(target)))) issues.push(`missing public file: ${href}`);
		} else if (/\.(png|jpe?g|gif|svg|webp)$/i.test(target)) {
			if (!existsSync(resolve(dirname(file), decodeURIComponent(target)))) issues.push(`missing image: ${href}`);
		} else if (target.startsWith('/')) {
			const slug = target.replace(/^\/(es\/)?|\/$/g, '');
			if (!slugs.has(slug) && !pageExists(slug)) issues.push(`link to a page that is not in the slug map: ${href}`);
			if (!target.endsWith('/')) issues.push(`link without trailing slash: ${href}`);
		} else issues.push(`relative link (use an absolute /slug/): ${href}`);
	}
	for (const m of body.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
		const target = m[1];
		if (/^\/(documents|network-assets)\//.test(target) && !existsSync(join(ROOT, 'public', decodeURIComponent(target)))) issues.push(`missing public file: ${target}`);
		if (/^\/docs\b/.test(target)) issues.push(`v1 link: ${target}`);
	}

	if (issues.length) {
		problems += issues.length;
		console.log(relative(ROOT, file));
		for (const issue of issues) console.log(`  ${issue}`);
	}
}
console.log(`${files.length} files, ${problems} problems`);
if (problems) process.exitCode = 1;
