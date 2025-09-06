import type { Model } from '../language/generated/ast.js';
import chalk from 'chalk';
import { Command } from 'commander';
import { CypressTestGeneratorLanguageMetaData } from '../language/generated/module.js';
import { createCypressTestGeneratorServices } from '../language/cypress-test-generator-module.js';
import { extractAstNode } from './cli-util.js';
import { generateCypress } from './generator.js';
import { NodeFileSystem } from 'langium/node';
import * as url from 'node:url';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const packagePath = path.resolve(__dirname, '..', '..', 'package.json');
const packageContent = await fs.readFile(packagePath, 'utf-8');

export const generateAction = async (fileName: string, opts: GenerateOptions): Promise<void> => {
    const services = createCypressTestGeneratorServices(NodeFileSystem).CypressTestGenerator;
    const model = await extractAstNode<Model>(fileName, services);
    console.log('Modell geladen?', model ? 'ja' : 'nein');


    if (!model) {
        console.error(chalk.red('AST konnte nicht extrahiert werden.'));
        return;
    }

    const generatedFilePath = generateCypress(model, fileName, opts.destination);
    console.log(chalk.green(`Cypress Code erfolgreich generiert: ${generatedFilePath}`));
};


export type GenerateOptions = {
    destination?: string;
}

export default function(): void {
    const program = new Command();

    program.version(JSON.parse(packageContent).version);

    const fileExtensions = CypressTestGeneratorLanguageMetaData.fileExtensions.join(', ');
    program
        .command('generate')
        .argument('<file>', `source file (possible file extensions: ${fileExtensions})`)
        .option('-d, --destination <dir>', 'destination directory of generating')
        .description('Generates Cypress tests from a DSL specification / Erzeugt Cypress-Tests aus einer DSL-Spezifikation')
        .action(generateAction);

    program.parse(process.argv);
}
//generateAction('test/dsl/login.cdsl', { destination: 'out/generated' });

