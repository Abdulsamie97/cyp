import { describe, expect, test } from 'vitest';
import * as path from 'node:path';
import { extractDestinationAndName } from '../../src/cli/cli-util.js';

describe('extractDestinationAndName', () => {
    const inputPath = path.join('test', 'dsl', 'login.cdsl');

    test('returns default destination when none is provided', () => {
        const result = extractDestinationAndName(inputPath, undefined);
        expect(result).toEqual({ destination: path.join('out', 'generated'), name: 'login' });
    });

    test('uses provided destination', () => {
        const result = extractDestinationAndName(inputPath, path.join('out', 'tests'));
        expect(result).toEqual({ destination: path.join('out', 'tests'), name: 'login' });
    });
});