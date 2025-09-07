import { beforeAll, describe, expect, test } from 'vitest';
import { EmptyFileSystem } from 'langium';
import { parseHelper } from 'langium/test';
import { createCypressTestGeneratorServices } from '../../src/language/cypress-test-generator-module.js';
import type { Model } from '../../src/language/generated/ast.js';

let services: ReturnType<typeof createCypressTestGeneratorServices>;
let parse: ReturnType<typeof parseHelper<Model>>;

beforeAll(async () => {
    services = createCypressTestGeneratorServices(EmptyFileSystem);
    parse = parseHelper<Model>(services.CypressTestGenerator);
});

describe('Parsing tests', () => {
    test('parse simple model', async () => {
        const document = await parse(`
            TEST login
            FILL username WITH "user"
            CLICK loginButton
            EXPECT TEXT loginSuccess IN successData
            NAVIGATE TO homeUrl
        `);

        expect(document.parseResult.parserErrors).toHaveLength(0);
        const testNode = document.parseResult.value?.tests[0];
        expect(testNode?.name).toBe('login');
        expect(testNode?.steps).toHaveLength(4);
    });
    
    test('report parser errors for invalid syntax', async () => {
        const document = await parse(`
            TEST login
            FILL username "user"
        `);
        expect(document.parseResult.parserErrors.length).toBeGreaterThan(0);
    });
});
