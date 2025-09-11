
import { describe, it, expect } from 'vitest';
import { selectorMap } from '../../src/cli/selectors.js';
import { testData } from '../../src/cli/test-data.js';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..', '..');

function findPlaceholders(search: string, extract: RegExp): string[] {
    try {
        const out = execFileSync('rg', ['--no-heading', '-n', search, 'src'], {
            cwd: repoRoot,
            encoding: 'utf8'
        });
        return out
            .split(/\r?\n/)
            .map(line => extract.exec(line)?.[1])
            .filter((v): v is string => Boolean(v));
    } catch {
        return [];
    }
}

describe('static data', () => {
    it('selectorMap has no duplicate keys', () => {
        const keys = Object.keys(selectorMap);
        expect(new Set(keys).size).toBe(keys.length);
    });

    it('testData has no duplicate keys', () => {
        const keys = Object.keys(testData);
        expect(new Set(keys).size).toBe(keys.length);
    });

    it('all referenced placeholders exist in maps', () => {
        const selectorKeys = [
            ...findPlaceholders("resolve\\(selectorMap, '", new RegExp("resolve\\(selectorMap, '([^']+)'")),
            ...findPlaceholders("step\\.selector\\s*===\\s*'", new RegExp("step\\.selector\\s*===\\s*'([^']+)'"))
        ];
        const testDataKeys = [
            ...findPlaceholders("resolve\\(testData, '", new RegExp("resolve\\(testData, '([^']+)'")),
        ];
        const uniqueSelectorKeys = Array.from(new Set(selectorKeys));
        const uniqueTestDataKeys = Array.from(new Set(testDataKeys));
        for (const key of uniqueSelectorKeys) {
            expect(selectorMap, 'Missing selector ' + key).toHaveProperty(key);
        }
        for (const key of uniqueTestDataKeys) {
            expect(testData, 'Missing test data ' + key).toHaveProperty(key);
        }
    });
});