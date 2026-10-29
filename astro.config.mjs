// @ts-check
import { existsSync, readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
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

export default defineConfig({
	site,
	server: { port: 3310 },
	integrations: [
		starlight({
			title: 'VerifiedX Docs',
			description: 'Documentation for VerifiedX (VFX): the Bitcoin reliever chain, vBTC, Trillium, and the VFX SDKs.',
			logo: { src: './src/assets/vfx-wordmark-light.svg', replacesTitle: true, alt: 'VerifiedX' },
			favicon: '/favicon.ico',
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
				Banner: './src/components/Banner.astro',
			},
			routeMiddleware: './src/route-middleware.ts',
			sidebar: [
				{ label: 'Learn', translations: { es: 'Aprende' }, items: [{ autogenerate: { directory: 'learn' } }] },
				{
					label: 'Build',
					translations: { es: 'Desarrolla' },
					items: [
						{
							label: 'JavaScript SDK',
							translations: { es: 'SDK de JavaScript' },
							items: [{ autogenerate: { directory: 'build/sdk' } }],
						},
						{
							label: 'Smart contracts',
							translations: { es: 'Contratos inteligentes' },
							items: [{ autogenerate: { directory: 'build/smart-contracts' } }],
						},
					],
				},
			],
			plugins: [
				starlightPageActions({ actions: { markdown: true, claude: true, chatgpt: true } }),
				starlightLlmsTxt({ projectName: 'VerifiedX' }),
				starlightLinksValidator({ exclude: isPendingLink }),
			],
		}),
	],
});
