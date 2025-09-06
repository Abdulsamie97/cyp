import { describe, expect, test, vi } from 'vitest';
import { resolve } from '../../src/cli/generator.js';

describe('resolve', () => {
    const map = { known: 'value' };

    test('throws on unknown key by default', () => {
        expect(() => resolve(map, 'unknown', 'Testdaten')).toThrow();
    });

    test('warns and returns key when failOnMissing is false', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const result = resolve(map, 'unknown', 'Testdaten', false);
        expect(warn).toHaveBeenCalled();
        expect(result).toBe('unknown');
        warn.mockRestore();
    });


   test('suggests existing key for different casing', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const result = resolve(map, 'KNOWN', 'Selektor');
        expect(result).toBe('value');
        expect(warn).toHaveBeenCalledWith("Selektor 'KNOWN' nicht gefunden. Meintest du 'known'?");
        warn.mockRestore();
    });
});