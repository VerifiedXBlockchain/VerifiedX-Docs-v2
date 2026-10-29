// Writes src/generated/build-data.json before every dev/build run:
//   - which network this build is for (main branch = mainnet, every other branch = testnet)
//   - on testnet, which pages are new or changed compared with the main branch
//   - which translated pages are stale against their English source
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONTENT_DIR, LOCALES, fileToSlug, listContentFiles, sourceHash, readSourceHash, englishSourceFor } from './lib/content.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT = `${ROOT}src/generated/build-data.json`;
const MAIN_BRANCH = 'main';
const REPO_URL = process.env.DOCS_REPO_URL ?? 'https://github.com/VerifiedXBlockchain/VerifiedX-Docs-v2.git';

const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim();

function currentBranch() {
	if (process.env.VERCEL_GIT_COMMIT_REF) return process.env.VERCEL_GIT_COMMIT_REF;
	try {
		return git('rev-parse', '--abbrev-ref', 'HEAD');
	} catch {
		return MAIN_BRANCH;
	}
}

function resolveNetwork(branch) {
	const forced = process.env.DOCS_NETWORK;
	if (forced) {
		if (forced !== 'mainnet' && forced !== 'testnet') throw new Error(`DOCS_NETWORK must be mainnet or testnet, got "${forced}"`);
		return forced;
	}
	return branch === MAIN_BRANCH ? 'mainnet' : 'testnet';
}

// Returns a ref for the main branch's tree. Vercel clones shallow with only the built branch, so fetch main if needed.
function mainRef() {
	try {
		return git('rev-parse', '--verify', `origin/${MAIN_BRANCH}`);
	} catch {
		git('fetch', '--depth=1', REPO_URL, MAIN_BRANCH);
		return git('rev-parse', '--verify', 'FETCH_HEAD');
	}
}

function diffAgainstMain(ref) {
	const added = new Set();
	const changed = new Set();
	const output = git('diff', '--name-status', '--no-renames', ref, '--', CONTENT_DIR);
	for (const line of output.split('\n').filter(Boolean)) {
		const [status, file] = line.split('\t');
		if (status === 'A') added.add(fileToSlug(file));
		else if (status === 'M') changed.add(fileToSlug(file));
	}
	for (const file of git('ls-files', '--others', '--exclude-standard', '--', CONTENT_DIR).split('\n').filter(Boolean)) {
		added.add(fileToSlug(file));
	}
	return { added: [...added].sort(), changed: [...changed].sort() };
}

function staleTranslations() {
	const stale = [];
	for (const file of listContentFiles()) {
		const english = englishSourceFor(file);
		if (!english) continue;
		if (readSourceHash(file) !== sourceHash(english)) stale.push(fileToSlug(file));
	}
	return stale.sort();
}

const branch = currentBranch();
const network = resolveNetwork(branch);
let diff = { added: [], changed: [] };
let comparedTo = null;
if (network === 'testnet') {
	try {
		comparedTo = mainRef();
		diff = diffAgainstMain(comparedTo);
	} catch (error) {
		// A testnet build without the mainnet comparison would silently drop every "differs from mainnet" notice.
		if (process.env.DOCS_ALLOW_NO_DIFF !== '1') {
			throw new Error(`Could not compare against ${MAIN_BRANCH}: ${error.message}\nSet DOCS_ALLOW_NO_DIFF=1 to build without testnet badges.`);
		}
		console.warn(`[build-data] building without testnet badges: ${error.message}`);
	}
}

const data = { network, branch, comparedTo, ...diff, staleTranslations: staleTranslations(), locales: LOCALES };
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(data, null, '\t') + '\n');
console.log(`[build-data] ${network} (${branch}): ${diff.added.length} new, ${diff.changed.length} changed vs ${MAIN_BRANCH}; ${data.staleTranslations.length} stale translations`);
