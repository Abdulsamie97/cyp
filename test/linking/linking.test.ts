import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { EmptyFileSystem, type LangiumDocument } from 'langium';
import { clearDocuments, parseHelper } from 'langium/test';
import { createCypressTestGeneratorServices } from '../../src/language/cypress-test-generator-module.js';
import type { Model } from '../../src/language/generated/ast.js';

let services: ReturnType<typeof createCypressTestGeneratorServices>;
let parse: ReturnType<typeof parseHelper<Model>>;
let document: LangiumDocument<Model> | undefined;

beforeAll(async () => {
    services = createCypressTestGeneratorServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.CypressTestGenerator);
});

afterEach(() => {
    document && clearDocuments(services.shared, [document]);
});

describe('Linking tests', () => {
    test('linking produces no errors', async () => {
        document = await parse(`
            TEST login
            CLICK loginButton
        `);
        expect(document.diagnostics ?? []).toHaveLength(0);
    });
});