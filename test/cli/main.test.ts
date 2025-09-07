import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const nodeBin = process.execPath;
const langium = path.join('node_modules', '.bin', 'langium');
const cli = path.join('bin', 'cli.js');
const generatedDir = path.join('test', 'dsl', 'generated');
const generatedFile = path.join(generatedDir, 'login.cy.js');

beforeAll(async () => {
    await execFileAsync(langium, ['generate']);
    await execFileAsync('npm', ['run', 'build']);
});

afterAll(async () => {
    await fs.rm(generatedDir, { recursive: true, force: true });
    await fs.rm(path.join('src', 'language', 'generated'), { recursive: true, force: true });
    await fs.rm('out', { recursive: true, force: true });
    await fs.rm(path.join('src', 'syntaxes'), { recursive: true, force: true });
});

describe('CLI main', () => {
    test('exits with error code for invalid file', async () => {
        await expect(
            execFileAsync(nodeBin, [cli, 'generate', 'test/dsl/invalid.cdsl'])
        ).rejects.toMatchObject({ code: 1 });
    });

    test('generates output for valid file', async () => {
        await execFileAsync(nodeBin, [cli, 'generate', 'test/dsl/login.cdsl']);
        expect(existsSync(generatedFile)).toBe(true);
    });
});
