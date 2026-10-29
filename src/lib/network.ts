import buildData from '../generated/build-data.json';

export type Network = 'mainnet' | 'testnet';
export type PageNetworkStatus = 'new' | 'changed' | null;

export const network = buildData.network as Network;

export const siteUrls: Record<Network, string> = {
	mainnet: import.meta.env.PUBLIC_MAINNET_URL ?? 'https://docs.verifiedx.io',
	testnet: import.meta.env.PUBLIC_TESTNET_URL ?? 'https://testnet.docs.verifiedx.io',
};

const added = new Set(buildData.added);
const changed = new Set(buildData.changed);
const stale = new Set(buildData.staleTranslations);

function withoutLocale(slug: string): string {
	const locale = buildData.locales.find((l) => slug === l || slug.startsWith(`${l}/`));
	return locale ? slug.slice(locale.length).replace(/^\//, '') : slug;
}

// How a page on the testnet site compares with mainnet. A translated page counts as changed when its English source changed.
export function pageNetworkStatus(slug: string): PageNetworkStatus {
	if (network !== 'testnet') return null;
	const english = withoutLocale(slug);
	if (added.has(slug) || added.has(english)) return 'new';
	if (changed.has(slug) || changed.has(english)) return 'changed';
	return null;
}

export function isStaleTranslation(slug: string): boolean {
	return stale.has(slug);
}

export function slugFromHref(href: string): string {
	return href.replace(/^https?:\/\/[^/]+/, '').replace(/[#?].*$/, '').replace(/^\/|\/$/g, '').toLowerCase();
}
