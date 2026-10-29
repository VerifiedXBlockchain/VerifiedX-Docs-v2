import { defineRouteMiddleware } from '@astrojs/starlight/route-data';
import { getCollection } from 'astro:content';
import { network, slugFromHref } from './lib/network';

let docSlugs: Promise<Set<string>> | undefined;
const existingSlugs = () =>
	(docSlugs ??= getCollection('docs').then((entries) => new Set(entries.map((entry) => entry.id.replace(/(^|\/)index$/, '').toLowerCase()))));

// Untranslated Spanish pages are English fallbacks: keep them out of search results, and only advertise
// hreflang alternates for languages a page actually exists in.
export const onRequest = defineRouteMiddleware(async (context) => {
	const route = context.locals.starlightRoute;
	const slugs = await existingSlugs();
	const isAlternate = (entry: (typeof route.head)[number]) => entry.tag === 'link' && entry.attrs?.rel === 'alternate' && 'hreflang' in (entry.attrs ?? {});
	const alternates = route.head.filter(isAlternate);
	const real = alternates.filter((entry) => entry.attrs?.hreflang === 'x-default' || slugs.has(slugFromHref(String(entry.attrs?.href))));
	const languages = real.filter((entry) => entry.attrs?.hreflang !== 'x-default');
	const keep = new Set(languages.length > 1 ? real : []);
	route.head = route.head.filter((entry) => !isAlternate(entry) || keep.has(entry));
	if (route.isFallback && network !== 'testnet') route.head.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex' } });
});
