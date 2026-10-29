import type { APIRoute } from 'astro';
import { network } from '../lib/network';

// Mainnet is indexed; the testnet site and PR previews are not.
export const GET: APIRoute = ({ site }) => {
	const body =
		network === 'testnet'
			? 'User-agent: *\nDisallow: /\n'
			: `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site)}\n`;
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
