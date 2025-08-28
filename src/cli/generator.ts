import type { Model } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { selectorMap } from './selectors.js';
import { testData } from './test-data.js';
import { extractDestinationAndName } from './cli-util.js';


function resolve(map: Record<string, string>, key: string, kind: string): string {
    if (map[key]) {
        return map[key];
    }
    const suggestion = Object.keys(map).find(k => k.toLowerCase() === key.toLowerCase());
    if (suggestion) {
        console.warn(`${kind} '${key}' nicht gefunden. Meintest du '${suggestion}'?`);
        return map[suggestion];
    }
    console.warn(`${kind} '${key}' nicht gefunden. Verfügbare ${kind.toLowerCase()}e: ${Object.keys(map).join(', ')}`);
    return key;
}

export function generateCypress(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const cypressFolder = data.destination ?? 'src/generated';

    if (!fs.existsSync(cypressFolder)) {
        fs.mkdirSync(cypressFolder, { recursive: true });
    }

    const generatedFilePath = path.join(cypressFolder, `${data.name}.cy.js`);
    console.log('Schreibe Datei nach:', generatedFilePath);

    if (!model.tests || model.tests.length === 0) {
        console.warn('Keine Tests im Modell gefunden.');
        return generatedFilePath;
    }

    let output = '';

    for (const test of model.tests) {
        output += `describe('${test.name}', () => {\n`;
        output += `  it('${test.name}', () => {\n`;

        for (const step of test.steps) {
            if (step.$type === 'Navigate') {
                const actualUrl = testData[step.url] ? resolve(testData, step.url, 'Testdaten') : step.url;
                output += `    cy.visit('${actualUrl}');\n`;
            } else if (step.$type === 'Fill') {
                const valueKey = step.value.replace(/^["']|["']$/g, '');
                const actualValue = resolve(testData, valueKey, 'Testdaten');
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                output += `    cy.get('${selector}').type(${JSON.stringify(actualValue)});\n`;
            } else if (step.$type === 'Click') {
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                output += `    cy.get('${selector}').click();\n`;
            } else if (step.$type === 'ExpectText') {
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                const expectedText = resolve(testData, step.text, 'Testdaten');
                output += `    cy.get('${selector}').contains(${JSON.stringify(expectedText)});\n`;
            }
        }

        output += `  });\n});\n\n`;
    }

    fs.writeFileSync(generatedFilePath, output);
    console.log('Generation abgeschlossen.');

    return generatedFilePath;
}
