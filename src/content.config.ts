import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// On translated pages: hash of the English file this translation was made from (scripts/translations.mjs stamp).
				sourceHash: z.string().optional(),
			}),
		}),
	}),
	i18n: defineCollection({
		loader: i18nLoader(),
		schema: i18nSchema({
			extend: z.object({
				'vfx.network.mainnet': z.string(),
				'vfx.network.testnet': z.string(),
				'vfx.network.label': z.string(),
				'vfx.network.notOnMainnet': z.string(),
				'vfx.network.badgeNew': z.string(),
				'vfx.network.badgeChanged': z.string(),
				'vfx.network.calloutNew': z.string(),
				'vfx.network.calloutChanged': z.string(),
				'vfx.network.viewMainnet': z.string(),
				'vfx.translation.stale': z.string(),
			}),
		}),
	}),
};
