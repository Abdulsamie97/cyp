
import { describe, expect, test, vi } from 'vitest';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { generateCypress } from '../../src/cli/generator.js';

function createTempFilePath(name: string): { tempDir: string; filePath: string } {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cyp-generator-'));
    const filePath = path.join(tempDir, `${name}.cdsl`);
    return { tempDir, filePath };
}

describe('generateCypress', () => {
    test('throws error when MOODLE_USER and MOODLE_PASS are missing', () => {
        const origUser = process.env.MOODLE_USER;
        const origPass = process.env.MOODLE_PASS;
        delete process.env.MOODLE_USER;
        delete process.env.MOODLE_PASS;

        const { tempDir, filePath } = createTempFilePath('missing-env');
        const model = { tests: [{ name: 'dummy', steps: [] }] } as any;

        const exitMock = vi.spyOn(process, 'exit').mockImplementation(((code?: number) => { throw new Error(`exit ${code}`); }) as any);
        expect(() => generateCypress(model, filePath, undefined)).toThrow();
        exitMock.mockRestore();

        fs.rmSync(tempDir, { recursive: true, force: true });
        if (origUser !== undefined) process.env.MOODLE_USER = origUser;
        if (origPass !== undefined) process.env.MOODLE_PASS = origPass;
    });

    test('writes empty file when no tests are present', () => {
        const { tempDir, filePath } = createTempFilePath('no-tests');
        const model = { tests: [] } as any;
        const generated = generateCypress(model, filePath, undefined);
        expect(fs.existsSync(generated)).toBe(true);
        expect(fs.readFileSync(generated, 'utf-8')).toBe('');
        fs.rmSync(tempDir, { recursive: true, force: true });
    });

    test('generates file with selectors and test data', () => {
        const { tempDir, filePath } = createTempFilePath('with-test');
        const model = {
            tests: [
                {
                    name: 'login',
                    steps: [
                        { $type: 'Navigate', url: 'url' },
                        { $type: 'Fill', selector: 'username', value: '"messageBox"' },
                        { $type: 'Click', selector: 'loginButton' },
                        { $type: 'ExpectText', selector: 'loginSuccess', text: 'dozierenBox' }
                    ]
                }
            ]
        } as any;
        const generated = generateCypress(model, filePath, undefined);
        const content = fs.readFileSync(generated, 'utf-8');
        expect(content).toContain("cy.visit('https://lsf.htw-berlin.de')");
        expect(content).toContain("cy.get('.loginuser').type(\"575524\")");
        expect(content).toContain("cy.get('.submit').click()");
        expect(content).toContain("Dozierendenpl\u00e4ne");
        fs.rmSync(tempDir, { recursive: true, force: true });
    });
});