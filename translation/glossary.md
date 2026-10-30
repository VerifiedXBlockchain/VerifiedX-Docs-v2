# Spanish (Latin America) translation glossary

Every translation agent and reviewer follows this file. Manuel reviews Spanish pages against it; his corrections are added here so the next run learns them.

## Voice

- Latin American Spanish. The site tags pages `lang="es"` because Starlight and its plugins only ship UI strings for `es`; the regional voice comes from this glossary. Neutral, no regionalisms tied to one country.
- Address the reader as **tú**, never usted. Imperatives use the tú form: "Instala", "Revisa", "Envía".
- Keep the meaning and structure of the English page. Translate; don't rewrite, summarize, or add content.
- Sentence case for headings, as in English.
- Don't mix impersonal and tú forms in one sentence. "Se conserva la exposición mientras liberas eficiencia" mixes them; write "Conserva la exposición mientras liberas eficiencia" (tú) or "Se conserva la exposición y se libera eficiencia" (impersonal).
- Plurals of acronyms: "NFTs" takes an -s, as in the SwitchBlade wallet. Other acronyms don't: "los SDK", "las API".

## Never translate

Keep these exactly as written in English:

- Product and network names: VerifiedX, VFX, vBTC, vBTC.b, Trillium, Prism, SwitchBlade, Spyglass, Bfly (always "Bfly", never "Butterfly"), PulseXAI, Tanto, Pocket, Sharp
- Protocol names and acronyms: SEN (Self-Executing Node), FROST, DKG, S3C, ADNR, VFX10, VFX20, MPC, HSM, KMS, DeFi, NFT, L1, L2
- "Mainnet" and "testnet", "signet"
- Finance terms: prime brokerage
- Code of any kind: code blocks, inline code, API paths, CLI commands, method names, field names, JSON keys, environment variables, file names
- Link targets (URLs). Link text is translated.

Code comments inside code blocks stay in English, so the code matches the SDK and the English docs.

## Translate, with the English term in parentheses on first use per page

| English | Spanish |
|---|---|
| Proof of Assurance | Prueba de Garantía (Proof of Assurance) |
| validator | validador (validator) |
| vault | bóveda (vault) |
| wrapped (token, asset) | envuelto (wrapped) |
| mnemonic (SDK pages) | frase de recuperación (mnemónico) |

## Preferred terms

| English | Spanish |
|---|---|
| wallet | billetera |
| address | dirección |
| private key / public key | clave privada / clave pública |
| mnemonic phrase, recovery phrase | frase de recuperación (as in the SwitchBlade wallet; never "frase mnemotécnica") |
| transaction | transacción |
| balance | saldo |
| fee | comisión |
| smart contract | contrato inteligente |
| token | token |
| on-chain | on-chain |
| threshold signing | firma por umbral |
| custody / custodian | custodia / custodio |
| redemption | redención |
| settlement | liquidación |
| finality | finalidad |
| node | nodo |
| faucet | faucet |
| endpoint | endpoint |
| trustless | sin intermediarios de confianza (never "sin necesidad de confianza") |
| allocator (institutional) | la institución ("Firma controlada por la institución"; never "asignador") |
| agentic economy | economía agéntica ("la economía agéntica emergente") |
| custodial bridge | puente custodial |
| IOU | pagaré |
| off-chain | externo a la cadena |
| cross-chain | multicadena |
| lending and borrowing | otorgar y tomar préstamos |
| mint / burn | emitir / quemar (emisión / quema) |
| escrow | depósito en garantía (as in the SwitchBlade wallet) |
| compliance | cumplimiento |
| taken at its word | se confía ciegamente en |
| Node API | API del nodo |
| Web API | Web API (a product name, as in "Web API (Spyglass)") |
| JavaScript SDK, Web SDK | SDK de JavaScript, VerifiedX Web SDK |
| reserve account | cuenta de reserva (the wallet's "Vault Account" label is "Cuenta de bóveda") |
| call back (a reserve send) | devolver, "(call back)" on first use (wallet: "Devolver") |
| unlock time (a moment) | hora de desbloqueo |
| watched vault / legacy vault | bóveda vigilada / bóveda heredada (legacy) |
| Bitcoin attestation / attest | certificación de Bitcoin / certificar |
| recording height / enforcement height | altura de registro / altura de aplicación |
| pin / pinned (withdrawal) | fijar / fijado, fijación (wallet: "Fijación de retiro vBTC") |
| release (a pinned withdrawal) | liberar / liberación |
| fee raise / bump | subir la comisión / subida de comisión (wallet: "Subir comisión") |
| fee rate | tasa de comisión |
| fee floor | mínimo de comisión |
| share (of a multi-vault withdrawal) | porción (never "parte", which is used for key shares) |
| key ceremony / key shares | ceremonia de claves / partes de clave |
| validator bond | fianza (bond) (never "garantía", which belongs to Prueba de Garantía and depósito en garantía) |
| shield / unshield / shielded pool | blindar / desblindar / fondo blindado (wallet) |
| deploy | desplegar / despliegue (never "implementar") |
| broadcast | transmitir / transmisión |
| ban (token address) | bloquear (wallet: "Bloquear dirección") |
| holder | tenedor; owner: propietario |
| mintable / burnable | emitible / quemable (wallet) |
| supply | suministro (wallet) |
| listing / bid | publicación / oferta (wallet) |
| royalty | regalía |
| dry run | ejecución de prueba (dry run) |
| raw (vBTC raw integration) | sin SDK ("Integración sin SDK") |
| master node | nodo maestro (master node) |
| ledger rules | reglas del libro mayor |
| Q4 2026 (roadmap) | T4 2026 |
| Returns / Parameters / Summary (API reference labels) | Devuelve / Parámetros / Resumen |

Kept in English: stake, beacon (masculine), heartbeat (as "latido (heartbeat)"), casters, lockbox, outpoint, snapshot, watchdog, pool, payload, digest, soulbound, Whitepaper, HTTP status text, brand colour names, Core CLI prompts and console menu labels (the CLI is not localised), operating-system labels (Windows and macOS menus), and Spyglass explorer labels (the explorer is English only). Numbers keep the English separators (5,000 and 0.01) to match the code and the wallet.

## Wallet labels

The SwitchBlade wallet ships in Spanish, so a Spanish page names buttons, tabs, screens and fields exactly as the Spanish wallet shows them. `translation/wallet-terms.tsv` lists the wallet's strings as English<TAB>Spanish: look up the English label (case-insensitive) and use the Spanish one, in the same formatting as the English page (bold stays bold). If a label is not in the file, translate it and keep the English label in parentheses on first use. The wallet's wording also settles general terms not listed above. When this glossary and the wallet disagree, this glossary wins. A wallet label written in backticks on the English page is still a label, not code: use the Spanish label, keeping the backticks.

## Page mechanics

- Internal links get the `/es/` prefix: `/wallet/installation/` → `/es/wallet/installation/`. Links to `/documents/…`, `/network-assets/…`, files and external URLs stay as they are.
- A Spanish page sits one folder deeper than its English source, so every relative path (MDX `import` of components and images, Markdown images) gains one `../`.
- Frontmatter: translate `title`, `description`, `sidebar.label`, hero text and action labels. Keep `sidebar.order`, `sidebar.attrs`, `template` and every other key as is.
- Translate image alt text, component props that are shown to readers (`title`, `label`, `description`, button text) and table contents. Heading anchors change with the heading text, so update in-page `#anchor` links to the translated heading's slug.
- A folder's `_meta.yml` gets a Spanish copy with only `label` translated.

## Process

1. Translate the English file to the same path under `src/content/docs/es/`.
2. Run `npm run translations:stamp -- src/content/docs/es/<path>` to record which English version it came from.
3. `node migration/lint.mjs src/content/docs/es/<path>` must report 0 problems.
4. Open the PR. The Vercel preview shows the Spanish page under `/es/`.
