import { beforeAll, describe, expect, test } from 'vitest';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { parseHelper } from 'langium/test';
import type { Diagnostic } from 'vscode-languageserver-types';
import { createCypressTestGeneratorServices } from '../../src/language/cypress-test-generator-module.js';
import type { Model } from '../../src/language/generated/ast.js';

let services: ReturnType<typeof createCypressTestGeneratorServices>;
let parse: ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createCypressTestGeneratorServices(EmptyFileSystem);
    const doParse = parseHelper<Model>(services.CypressTestGenerator);
    parse = (input: string) => doParse(input, { validation: true });
});

describe('Validating', () => {
    test('check no errors', async () => {
        document = await parse(`
            TEST login
            CLICK loginButton
        `);
        expect(document?.diagnostics ?? []).toHaveLength(0);
    });

    test('unknown selector produces error', async () => {
        document = await parse(`
            TEST login
            CLICK unknown
        `);
        const messages = document?.diagnostics?.map(diagnosticToString).join('\n');
        expect(messages).toContain("Selektor 'unknown' unbekannt");
    });
});

function diagnosticToString(d: Diagnostic) {
    return `[${d.range.start.line}:${d.range.start.character}..${d.range.end.line}:${d.range.end.character}]: ${d.message}`;
}