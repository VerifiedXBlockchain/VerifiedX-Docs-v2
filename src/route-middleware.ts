import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data';
import { pageNetworkStatus, slugFromHref } from './lib/network';

type SidebarEntry = StarlightRouteData['sidebar'][number];

// On the testnet site, badge sidebar links to pages that are new or changed compared with mainnet.
export const onRequest = defineRouteMiddleware((context) => {
	const { sidebar } = context.locals.starlightRoute;
	const t = context.locals.t;
	const badge = (entry: SidebarEntry) => {
		if (entry.type === 'group') {
			entry.entries.forEach(badge);
			return;
		}
		const status = pageNetworkStatus(slugFromHref(entry.href));
		if (status === 'new') entry.badge = { text: t('vfx.network.badgeNew'), variant: 'default', class: 'vfx-new' };
		else if (status === 'changed') entry.badge = { text: t('vfx.network.badgeChanged'), variant: 'default', class: 'vfx-changed' };
	};
	sidebar.forEach(badge);
});
