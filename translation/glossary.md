# Spanish (Latin America) translation glossary

Every translation agent and reviewer follows this file. Manuel reviews Spanish pages against it; his corrections are added here so the next run learns them.

## Voice

- Latin American Spanish. The site tags pages `lang="es"` because Starlight and its plugins only ship UI strings for `es`; the regional voice comes from this glossary. Neutral, no regionalisms tied to one country.
- Address the reader as **tú**, never usted. Imperatives use the tú form: "Instala", "Revisa", "Envía".
- Keep the meaning and structure of the English page. Translate; don't rewrite, summarize, or add content.
- Sentence case for headings, as in English.
- Don't mix impersonal and tú forms in one sentence. "Conserva la exposición mientras liberas eficiencia" mixes them; pick one.
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

## Process

1. Translate the English file to the same path under `src/content/docs/es/`.
2. Run `npm run translations:stamp -- src/content/docs/es/<path>` to record which English version it came from.
3. Open the PR. The Vercel preview shows the Spanish page under `/es/`.
