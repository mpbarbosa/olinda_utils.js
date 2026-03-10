/**
 * ESM integration smoke test — verifies dist/esm/index.js via child process
 * @module test/integration/esm
 * @description Verifies that the ESM build is valid and consumable via a Node
 * child process (`--input-type=module`). Jest runs in CJS mode, so we exec
 * a small ESM snippet and assert it exits cleanly with expected output.
 * @since 0.4.0
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const ESM_INDEX = path.resolve(__dirname, '../../dist/esm/index.js');
const ESM_PKG = path.resolve(__dirname, '../../dist/esm/package.json');

describe('ESM build — output integrity', () => {
	it('dist/esm/index.js exists', () => {
		expect(fs.existsSync(ESM_INDEX)).toBe(true);
	});

	it('dist/esm/package.json declares "type": "module"', () => {
		const pkg = JSON.parse(fs.readFileSync(ESM_PKG, 'utf8')) as Record<string, unknown>;
		expect(pkg.type).toBe('module');
	});

	it('ESM module imports and runs correctly via node --input-type=module', () => {
		const esmPath = ESM_INDEX.replace(/\\/g, '/');
		const script = [
			`import { camelCase, dedupe, deepClone, isEmpty, Logger, colors } from '${esmPath}';`,
			`if (camelCase('hello-world') !== 'helloWorld') throw new Error('camelCase failed');`,
			`if (JSON.stringify(dedupe([1,2,2,3])) !== '[1,2,3]') throw new Error('dedupe failed');`,
			`const c = deepClone({a:1}); if (c.a !== 1) throw new Error('deepClone failed');`,
			`if (isEmpty(null) !== true) throw new Error('isEmpty failed');`,
			`if (typeof Logger !== 'function') throw new Error('Logger not a function');`,
			`if (typeof colors !== 'object') throw new Error('colors not an object');`,
			`console.log('ESM OK');`,
		].join('\n');

		const result = execSync(`node --input-type=module`, {
			input: script,
			encoding: 'utf8',
			timeout: 10_000,
		});

		expect(result.trim()).toBe('ESM OK');
	});
});

