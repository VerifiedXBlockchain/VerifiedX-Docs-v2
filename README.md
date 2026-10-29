# VerifiedX Docs (v2)

Source for the VerifiedX documentation, built with [Starlight](https://starlight.astro.build) (Astro). English pages are at the root; Latin American Spanish pages are under `/es/`.

| Branch | Site |
|---|---|
| `main` | https://docs.verifiedx.io (mainnet docs) |
| `testnet` | https://testnet.docs.verifiedx.io (what is live on testnet ahead of mainnet) |

## Editing

Every page is a Markdown file in `src/content/docs/`. Use "Edit page" at the bottom of any page to open it on GitHub, edit it in the browser, and open a pull request. Each pull request gets a preview deployment.

- Pull requests target `testnet`. Changes reach mainnet when `testnet` is merged into `main`.
- Fixes merged straight into `main` must also be merged back into `testnet`.
- A page needs only `title` (and ideally `description`) in its frontmatter. The sidebar is built from the folders; use `sidebar.order` to order pages within a folder.
- Spanish pages live at the same path under `src/content/docs/es/`. Follow `translation/glossary.md`, then run `npm run translations:stamp -- <file>`.

## Testnet badges

On the testnet site, pages that are new or changed compared with `main` get a sidebar badge and a notice at the top. `scripts/build-data.mjs` works this out from git before every build; nothing is tagged by hand. The Mainnet/Testnet switch in the header opens the same page on the other site.

## Local development

Requires Node 24 (`nvm use`).

```bash
npm install
npm run dev          # http://localhost:3310
npm run build        # also checks every internal link
npm run translations:check
```

`DOCS_NETWORK=testnet npm run dev` previews the testnet site locally (badges compare against `origin/main`).
