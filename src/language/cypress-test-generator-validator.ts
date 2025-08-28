import type { ValidationChecks, ValidationAcceptor, AstNode } from 'langium';
import type { cypresstestgeneratorAstType, Fill, Test, Navigate, Click, ExpectText} from './generated/ast.js';
import type { CypressTestGeneratorServices } from './cypress-test-generator-module.js';
import { selectorMap } from '../cli/selectors.js';
import { testData } from '../cli/test-data.js';

/**
 * Register custom validation checks.
 * Hier kannst du Regeln für unterschiedliche AST-Elemente definieren.
 */
export function registerValidationChecks(services: CypressTestGeneratorServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = new CypressTestGeneratorValidator();
    const checks: ValidationChecks<cypresstestgeneratorAstType> = {
    Test: validator.checkTestHasSteps,
    Fill: [validator.checkFillNotEmpty, validator.checkFillPlaceholders],
    Navigate: validator.checkNavigateHasURL,
    Click: validator.checkClickSelector,
    ExpectText: validator.checkExpectTextPlaceholders
};

    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 * Du kannst hier neue Methoden für andere AST-Elemente wie Test, Fill, etc. hinzufügen.
 */
export class CypressTestGeneratorValidator {

    /**
     * Validiert, ob ein Test mindestens einen Schritt enthält.
     */
    checkTestHasSteps(node: Test, accept: ValidationAcceptor): void {
        if (!node.steps || node.steps.length === 0) {
            accept('error', 'Ein Test muss mindestens einen Schritt enthalten.', { node });
        }
    }

    /**
     * Validiert, ob ein Fill-Schritt einen Wert hat.
     */
    checkFillNotEmpty(node: Fill, accept: ValidationAcceptor): void {
        if (!node.value) {
            accept('error', 'Der Fill-Schritt muss einen Wert haben.', { node });
        }
    }

    checkFillPlaceholders(node: Fill, accept: ValidationAcceptor): void {
        this.checkPlaceholder(node.selector, selectorMap, 'Selektor', node, accept);
        const valueKey = node.value?.replace(/^['"]|['"]$/g, '');
        this.checkPlaceholder(valueKey, testData, 'Testdaten', node, accept);
    }


    /**
     * Validiert, ob ein Navigate-Schritt eine gültige URL enthält.
     */
    checkNavigateHasURL(node: Navigate, accept: ValidationAcceptor): void {
    if (!node.url) {
        accept('error', 'Der Navigate-Schritt muss einen URL-Schlüssel enthalten.', { node });
        return;
    }

    // Entferne die umgebenden Anführungszeichen (einfachster Weg)
    const allowedKeys = ['url']; // Erweitere nach Bedarf z. B. mit Object.keys(testData)
    if (!allowedKeys.includes(node.url)) {
        accept('warning', `Der Navigate-Schritt verwendet einen unbekannten URL-Schlüssel: '${node.url}'`, { node });
    }
}

    checkClickSelector(node: Click, accept: ValidationAcceptor): void {
        this.checkPlaceholder(node.selector, selectorMap, 'Selektor', node, accept);
    }

    checkExpectTextPlaceholders(node: ExpectText, accept: ValidationAcceptor): void {
        this.checkPlaceholder(node.selector, selectorMap, 'Selektor', node, accept);
        this.checkPlaceholder(node.text, testData, 'Testdaten', node, accept);
    }

    private checkPlaceholder(key: string | undefined, map: Record<string, string>, kind: string, node: AstNode, accept: ValidationAcceptor): void {
        if (!key) return;
        if (map[key]) return;
        const suggestion = Object.keys(map).find(k => k.toLowerCase() === key.toLowerCase());
        if (suggestion) {
            accept('warning', `${kind} '${key}' unbekannt. Meintest du '${suggestion}'?`, { node });
        } else {
            accept('warning', `${kind} '${key}' unbekannt. Verfügbare ${kind.toLowerCase()}e: ${Object.keys(map).join(', ')}`, { node });
        }
    }
    // Weitere Validierungen können hier hinzugefügt werden
}
