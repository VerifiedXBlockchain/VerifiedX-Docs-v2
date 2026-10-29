// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import starlightAutoSidebar from 'starlight-auto-sidebar';
import starlightLinksValidator from 'starlight-links-validator';
import starlightLlmsTxt from 'starlight-llms-txt';
import starlightPageActions from 'starlight-page-actions';

const buildData = JSON.parse(readFileSync(new URL('./src/generated/build-data.json', import.meta.url), 'utf8'));
const site = buildData.network === 'testnet' ? 'https://testnet.docs.verifiedx.io' : 'https://v2.docs.verifiedx.io';
const repo = 'https://github.com/VerifiedXBlockchain/VerifiedX-Docs-v2';
const editBranch = buildData.network === 'testnet' ? 'testnet' : 'main';

// While the migration runs, links to pages that are mapped in migration/slug-map.json but not ported yet are allowed.
// Every other broken internal link fails the build.
const slugMap = JSON.parse(readFileSync(new URL('./migration/slug-map.json', import.meta.url), 'utf8'));
const pendingSlugs = new Set(
	Object.values(slugMap).filter(
		(slug) => !['.md', '.mdx'].some((ext) => existsSync(new URL(`./src/content/docs/${slug}${ext}`, import.meta.url)))
	)
);
const isPendingLink = (/** @type {{ link: string }} */ { link }) =>
	pendingSlugs.has(link.replace(/^\/(es\/)?/, '').replace(/[#?].*$/, '').replace(/\/$/, ''));

// The sitemap lists Spanish pages only once they are translated; until then /es/ serves English fallbacks.
const isUntranslated = (/** @type {string} */ page) => {
	const match = new URL(page).pathname.match(/^\/es\/(.*?)\/?$/);
	if (!match) return false;
	const base = match[1] ? `./src/content/docs/es/${match[1]}` : './src/content/docs/es/index';
	return !['.md', '.mdx'].some((ext) => existsSync(new URL(base + ext, import.meta.url)));
};

export default defineConfig({
	site,
	server: { port: 3310 },
	// Renamed pages, so links shared before the rename still land.
	redirects: {
		'/learn/butterfly-and-pulsexai/': '/learn/bfly-and-pulsexai/',
		'/es/learn/butterfly-and-pulsexai/': '/es/learn/bfly-and-pulsexai/',
	},
	integrations: [
		// Declared here (Starlight would add it otherwise) so the filter applies; i18n matches the Starlight locales.
		sitemap({
			i18n: { defaultLocale: 'root', locales: { root: 'en', es: 'es' } },
			filter: (page) => !isUntranslated(page),
		}),
		starlight({
			title: 'VerifiedX Docs',
			description:
				'Documentation for VerifiedX (VFX), the financial operating system for Bitcoin. Use the wallet, learn how vBTC works, build with the SDKs and APIs, and run a node.',
			logo: { src: './src/assets/vfx-wordmark-light.svg', replacesTitle: true, alt: 'VerifiedX' },
			// Same cube icons and share card as verifiedx.io.
			favicon: '/favicon.png',
			head: [
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' } },
				{ tag: 'meta', attrs: { name: 'theme-color', content: '#0b1016' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: `${site}/og.jpg` } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { property: 'og:image:alt', content: 'VerifiedX: The Financial Operating System for Bitcoin' } },
				{ tag: 'meta', attrs: { name: 'twitter:image', content: `${site}/og.jpg` } },
				// The testnet site and PR previews document the same pages as mainnet; keep them out of search results.
				...(buildData.network === 'testnet' ? [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' } }] : []),
			],
			defaultLocale: 'root',
			locales: {
				root: { label: 'English', lang: 'en' },
				// Content is Latin American Spanish (translation/glossary.md). The tag stays "es": Starlight and its plugins only ship UI strings under "es".
				es: { label: 'Español', lang: 'es' },
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/VerifiedXBlockchain' },
				{ icon: 'x.com', label: 'X', href: 'https://x.com/VFXBlockchain' },
				{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/7cd5ebDQCj' },
			],
			editLink: { baseUrl: `${repo}/edit/${editBranch}/` },
			lastUpdated: true,
			customCss: [
				'@fontsource-variable/inter',
				'@fontsource/jetbrains-mono/400.css',
				'@fontsource/jetbrains-mono/600.css',
				'./src/styles/custom.css',
			],
			expressiveCode: {
				themes: ['github-dark-default'],
				useStarlightUiThemeColors: false,
				styleOverrides: {
					borderRadius: '0.5rem',
					borderColor: 'rgb(255 255 255 / 0.07)',
					codeBackground: '#070a0e',
					codeFontFamily: "'JetBrains Mono', ui-monospace, monospace",
					uiFontFamily: "'Inter Variable', system-ui, sans-serif",
					frames: {
						editorTabBarBackground: '#11171e',
						editorActiveTabBackground: '#070a0e',
						terminalTitlebarBackground: '#11171e',
						terminalBackground: '#070a0e',
						frameBoxShadowCssValue: 'none',
					},
				},
			},
			components: {
				ThemeProvider: './src/components/ThemeProvider.astro',
				SiteTitle: './src/components/SiteTitle.astro',
				ThemeSelect: './src/components/NetworkToggle.astro',
				SocialIcons: './src/components/SocialIcons.astro',
				Banner: './src/components/Banner.astro',
			},
			routeMiddleware: ['./src/route-middleware.ts', './src/seo-middleware.ts'],
			// One group per top-level section; folders inside a section get their label and order from _meta.yml.
			sidebar: [
				{ label: 'Learn', translations: { es: 'Aprende' }, collapsed: true, items: [{ autogenerate: { directory: 'learn', collapsed: true } }] },
				{ label: 'Use the Wallet', translations: { es: 'Usa la billetera' }, collapsed: true, items: [{ autogenerate: { directory: 'wallet', collapsed: true } }] },
				{ label: 'Build', translations: { es: 'Desarrolla' }, collapsed: true, items: [{ autogenerate: { directory: 'build', collapsed: true } }] },
				{ label: 'Run a Node', translations: { es: 'Ejecuta un nodo' }, collapsed: true, items: [{ autogenerate: { directory: 'node', collapsed: true } }] },
				{ label: 'Resources', translations: { es: 'Recursos' }, collapsed: true, items: [{ autogenerate: { directory: 'resources', collapsed: true } }] },
			],
			plugins: [
				starlightAutoSidebar(),
				starlightPageActions({ actions: { markdown: true, claude: true, chatgpt: true } }),
				starlightLlmsTxt({ projectName: 'VerifiedX' }),
				starlightLinksValidator({
					exclude: isPendingLink,
					// Node API docs link to http://localhost:7292, the API of a node running on the reader's machine.
					errorOnLocalLinks: false,
					// Spanish pages may link to pages not translated yet; those serve the English page with a notice.
					errorOnFallbackPages: false,
				}),
			],
		}),
	],
});
