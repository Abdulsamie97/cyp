+15-0
import { describe, expect, test } from 'vitest';
import { extractDestinationAndName } from '../../src/cli/cli-util.js';

describe('extractDestinationAndName', () => {
    test('returns default destination when none is provided', () => {
        const result = extractDestinationAndName('test/dsl/login.cdsl', undefined);
        expect(result).toEqual({ destination: 'test/dsl/generated', name: 'login' });
    });

    test('uses provided destination', () => {
        const result = extractDestinationAndName('test/dsl/login.cdsl', 'out/tests');
        expect(result).toEqual({ destination: 'out/tests', name: 'login' });
    });
});
