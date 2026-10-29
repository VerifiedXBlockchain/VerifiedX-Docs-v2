# Migrating v1 pages (English)

You are moving pages from the v1 docs (Docusaurus, VerifiedX-Docs) into this Starlight site. **Same words, new format.** English only: do not create or edit anything under `src/content/docs/es/`.

- v1 source: the exported `docs/` folder given in your task (VerifiedX-Docs origin/main `abf6cb1`).
- Old → new paths: `migration/slug-map.json`. Each page goes exactly where the map says.
- Reference pages already done: `src/content/docs/learn/vbtc.md`, `src/content/docs/build/sdk/vfx-basics.md`, `src/content/docs/build/smart-contracts/transferring.mdx`.

## Rules

1. Work only on the pages in your assignment and only write inside their folders. Other agents are working on other sections at the same time in the same checkout.
2. Do not run `npm run build`, `npm run dev`, `astro`, or any git command that changes state (no add, commit, checkout, stash). Parallel builds in one checkout break each other; the lead runs the build afterwards.
3. Keep the content. Don't rewrite, summarize, reorder sections, or "fix" facts. If something looks stale, wrong, or duplicated by another page, leave it and list it in your report.
4. Allowed formatting changes: frontmatter, removing the H1 (the title comes from frontmatter), promoting headings one level when a page has no `##` and uses `###` as its top level, removing decorative `---` separators directly between sections, fixing broken Markdown, adding a language tag or a `title="file.ts"` to a code block where the file name is obvious from the text.

## Steps per page

1. `node migration/convert.mjs <v1-docs-dir> <old-id>` writes a first pass to the new path and prints what still needs work.
2. Fix everything it reports, using the conversions below.
3. Add `description:` to the frontmatter: one plain sentence saying what the page covers, written from the page's own content. No new claims.
4. Sidebar order: the section's overview/intro page gets `sidebar: { order: 1 }`. Otherwise keep the v1 order the converter carried over. If the title is long (over ~32 characters), add a short `sidebar.label` (sentence case, like `VFX basics`).
5. When your pages are done: `node migration/lint.mjs <each folder you own>` must report 0 problems.

## Conversions

**Frontmatter:** only `title`, `description`, and `sidebar` (`order`, `label`, `attrs.class`). The converter maps v1's `sidebar_class_name` to `sidebar.attrs.class` (`sidebar-btc` colors Bitcoin pages orange in the sidebar). Keep it.

**Links:** absolute new slugs with a trailing slash: `[Run a validator](/node/validator/)`, anchors as `/node/validator/#testnet-quick-reference`. The converter rewrites most; fix any it reports as unresolved by finding the page in `slug-map.json`. PDFs and network assets keep their public paths (`/documents/x.pdf`, `/network-assets/x.png`). External links unchanged.

**Asides:** `:::note`, `:::tip`, `:::caution`, `:::danger` work as-is. `:::warning` → `:::caution`, `:::info` → `:::note`. A title is written in brackets: Docusaurus `:::note Testnet` → `:::note[Testnet]`.

**Python/NodeJS tabs** (any page using `<Tabs>`): rename the file to `.mdx`, delete the Docusaurus imports, and use:

```mdx
import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs syncKey="lang">
<TabItem label="NodeJS">

```js
...
```

</TabItem>
<TabItem label="Python">
...
</TabItem>
</Tabs>
```

Keep a blank line after `<TabItem ...>` and before `</TabItem>` so the code fences render. Use the labels exactly `NodeJS` and `Python` (with `syncKey="lang"`, picking a language once applies on every page).

**Images:** Markdown images with a relative path to `src/assets/media/...` (the converter fixes these). For `<img src={require('./media/x.png').default} width="300" />`: if the width doesn't matter, use a Markdown image; otherwise rename to `.mdx` and use `import x from '<relative path>'; import { Image } from 'astro:assets';` then `<Image src={x} alt="..." width={300} />`. Write real alt text.

**PDF download cards** (`<a href="/documents/x.pdf" ...><img ...><div>Click to Download</div></a>`): rename to `.mdx` and use the shared component:

```mdx
import DocumentDownload from '<relative path>/components/DocumentDownload.astro';
import cover from '<relative path>/assets/media/documents/vbtc-onesheet.png';

<DocumentDownload href="/documents/vBTC_OneSheet.pdf" cover={cover} title="vBTC One Sheet" />
```

**Buttons** (`<a className="button" ...>Launch X</a>`): rename to `.mdx` and use `import { LinkButton } from '@astrojs/starlight/components';` then `<LinkButton href="https://..." variant="secondary" icon="external">Launch X</LinkButton>`.

**Other JSX:** `className=` → `class=`, `style={{...}}` → remove (or a plain `style="..."` string if it matters). In `.md` files plain HTML is fine; JSX is not.

**Placeholders like `<vault>`, `<address>`, `<contract id>` in prose:** in a `.md` file these render as invisible HTML tags. If it is code-like, wrap it in backticks (`` `<vault>` ``); otherwise write `&lt;vault&gt;`. Inside code blocks and inline code, leave them alone.

**YouTube embeds:** delete (decision 2026-10-26: no YouTube embeds).

**Index-style pages** that only list links to the section's pages (e.g. `documents/documents.md`): keep them, with the links converted.

## Report

When done, reply with:
- pages migrated (old id → new file)
- anything you could not convert, and why
- pages you think are stale, wrong, or overlapping another page (Tyler decides; don't delete anything)
- final `migration/lint.mjs` output for your folders
