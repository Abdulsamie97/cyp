import type { Model, Navigate, Fill, Click, ExpectText } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { selectorMap } from './selectors.js';
import { testData } from './test-data.js';
import { extractDestinationAndName } from './cli-util.js';



dotenv.config({ path: path.resolve(process.cwd(), 'test-data.env') });

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
    const { MOODLE_USER, MOODLE_PASS } = process.env;

    for (const test of model.tests) {
        output += `describe('${test.name}', () => {\n`;
        output += `  it('${test.name}', () => {\n`;

        let insideMoodleOrigin = false;
        const steps = test.steps as Array<Navigate | Fill | Click | ExpectText>;

        for (const step of steps) {
            const indentation = insideMoodleOrigin ? '      ' : '    ';
            if (step.$type === 'Navigate') {
                const actualUrl = resolve(testData, step.url, 'Testdaten');
                output += `${indentation}cy.visit('${actualUrl}');\n`;
                output += `${indentation}cy.wait(1000);\n`;
            } else if (step.$type === 'Fill') {
                const valueKey = step.value.replace(/^["']|["']$/g, '');
                let actualValue = resolve(testData, valueKey, 'Testdaten');
                if (actualValue === 'MOODLE_USER') {
                    actualValue = MOODLE_USER ?? '';
                } else if (actualValue === 'MOODLE_PASS') {
                    actualValue = MOODLE_PASS ?? '';
                }
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                output += `${indentation}cy.get('${selector}').type(${JSON.stringify(actualValue)});\n`;
                output += `${indentation}cy.wait(1000);\n`;
            } else if (step.$type === 'Click') {
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                if (step.selector === 'moodleLink') {
                    const moodleUrl = resolve(testData, 'moodleUrl', 'Testdaten');
                    output += `${indentation}cy.get('${selector}').invoke('removeAttr', 'target').click();\n`;
                    output += `${indentation}cy.wait(1000);\n`;
                    output += `${indentation}cy.origin('${moodleUrl}', () => {\n`;
                    output += `${indentation}cy.wait(1000);\n`;
                    insideMoodleOrigin = true;
                } else {
                    output += `${indentation}cy.get('${selector}').click();\n`;
                    output += `${indentation}cy.wait(1000);\n`;
                }
            } else if (step.$type === 'ExpectText') {
                const selector = resolve(selectorMap, step.selector, 'Selektor');
                const expectedText = resolve(testData, step.text, 'Testdaten');
                output += `${indentation}cy.get('${selector}', { timeout: 10000 }).should('be.visible').and('contain', ${JSON.stringify(expectedText)});\n`;
            }
        }

        if (insideMoodleOrigin) {
            output += `    });\n`;
        }

        output += `  });\n});\n\n`;
    }

    fs.writeFileSync(generatedFilePath, output);
    console.log('Generation abgeschlossen.');

    return generatedFilePath;
}