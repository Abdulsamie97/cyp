import type { LangiumDocument } from 'langium';
import { AstUtils, CstUtils, GrammarUtils } from 'langium';
import { DefaultCompletionProvider } from 'langium/lsp';
import type { CompletionList, CompletionParams, CancellationToken } from 'vscode-languageserver';
import { selectorMap } from '../cli/selectors.js';
import { testData } from '../cli/test-data.js';
import { isClick, isExpectText, isFill, isNavigate } from './generated/ast.js';

/**
 * Completion provider that suggests selector and test data placeholders.
 */
export class CypressTestGeneratorCompletionProvider extends DefaultCompletionProvider {
    override async getCompletion(
        document: LangiumDocument,
        params: CompletionParams,
        cancelToken?: CancellationToken
    ): Promise<CompletionList | undefined> {
        const root = document.parseResult.value.$cstNode;
        if (root) {
            const offset = document.textDocument.offsetAt(params.position);
            const leaf = CstUtils.findLeafNodeAtOffset(root, offset) ?? CstUtils.findLeafNodeBeforeOffset(root, offset);
            if (leaf) {
                const node = leaf.astNode;
                let values: string[] | undefined;

                const fill = AstUtils.getContainerOfType(node, isFill);
                if (fill) {
                    const sel = GrammarUtils.findNodeForProperty(fill.$cstNode, 'selector');
                    const val = GrammarUtils.findNodeForProperty(fill.$cstNode, 'value');
                    const withKw = GrammarUtils.findNodeForKeyword(fill.$cstNode, 'WITH');
                    if (sel && offset >= sel.offset && offset <= (withKw?.offset ?? Number.POSITIVE_INFINITY)) {
                        values = Object.keys(selectorMap);
                    } else if (val && offset >= val.offset && offset <= val.end) {
                        values = Object.keys(testData);
                    }
                }

                if (!values) {
                    const click = AstUtils.getContainerOfType(node, isClick);
                    if (click) {
                        const sel = GrammarUtils.findNodeForProperty(click.$cstNode, 'selector');
                        if (sel && offset >= sel.offset && offset <= sel.end) {
                            values = Object.keys(selectorMap);
                        }
                    }
                }

                if (!values) {
                    const expectText = AstUtils.getContainerOfType(node, isExpectText);
                    if (expectText) {
                        const sel = GrammarUtils.findNodeForProperty(expectText.$cstNode, 'selector');
                        const text = GrammarUtils.findNodeForProperty(expectText.$cstNode, 'text');
                        const inKw = GrammarUtils.findNodeForKeyword(expectText.$cstNode, 'IN');
                        if (sel && offset >= sel.offset && offset <= (inKw?.offset ?? Number.POSITIVE_INFINITY)) {
                            values = Object.keys(selectorMap);
                        } else if (text && offset >= text.offset && offset <= text.end) {
                            values = Object.keys(testData);
                        }
                    }
                }

                if (!values) {
                    const navigate = AstUtils.getContainerOfType(node, isNavigate);
                    if (navigate) {
                        const url = GrammarUtils.findNodeForProperty(navigate.$cstNode, 'url');
                        if (url && offset >= url.offset && offset <= url.end) {
                            values = Object.keys(testData);
                        }
                    }
                }

                if (values) {
                    return { isIncomplete: false, items: values.map(v => ({ label: v })) };
                }
            }
        }

          return undefined;
    }
}