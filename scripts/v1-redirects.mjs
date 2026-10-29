// Writes vercel.json with permanent redirects: v2.docs.verifiedx.io (the preview domain before the switch) to docs.verifiedx.io,
// and v1 (Docusaurus) URLs to their pages on this site.
// v1 served pages at /docs/<old id>, and a folder's index page also at /docs/<folder>. The mapping is migration/slug-map.json.
//   node scripts/v1-redirects.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { posix } from 'node:path';

const root = new URL('..', import.meta.url);
const slugMap = JSON.parse(readFileSync(new URL('migration/slug-map.json', root), 'utf8'));

const targets = new Map([
	['/docs', '/'],
	['/markdown-page', '/'],
]);
for (const [oldId, slug] of Object.entries(slugMap)) {
	targets.set(`/docs/${oldId}`, `/${slug}/`);
	const folder = posix.dirname(oldId);
	if (folder !== '.' && posix.basename(folder) === posix.basename(oldId)) targets.set(`/docs/${folder}`, `/${slug}/`);
}

const fromPreviewDomain = {
	source: '/:path*',
	has: [{ type: 'host', value: 'v2.docs.verifiedx.io' }],
	destination: 'https://docs.verifiedx.io/:path*',
	permanent: true,
};
// Each v1 URL is matched with and without a trailing slash.
const redirects = [
	fromPreviewDomain,
	...[...targets].flatMap(([source, destination]) => [
		{ source, destination, permanent: true },
		{ source: `${source}/`, destination, permanent: true },
	]),
];
writeFileSync(new URL('vercel.json', root), JSON.stringify({ $schema: 'https://openapi.vercel.sh/vercel.json', redirects }, null, '\t') + '\n');
console.log(`vercel.json: v2.docs host redirect + ${redirects.length - 1} redirects for ${targets.size} v1 URLs`);
