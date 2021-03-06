import {
  Node, LexicalToken, VariableType,
  EmptyVariableDeclaration, VariableDeclaration,
} from '../../../grammar';

import { Parser } from '../..';
import { Span } from '../../../position';
import { matchTypeDecl } from '../../parse-utils';

export function variableDecl(parser: Parser): Node {
  const start = parser.peek().span.start;

  parser.ignoreNewline();

  const identifier = parser.consume(LexicalToken.IDENTIFIER, 'Expected an identifier after "var"');

  let variableType: VariableType | null = null;
  if (parser.matchIgnoreNewline(LexicalToken.COLON)) {
    parser.ignoreNewline();

    variableType = matchTypeDecl(parser);
  }

  // If it's followed with an assignment return a variable declaration
  if (parser.matchIgnoreNewline(LexicalToken.EQUAL)) {
    parser.ignoreNewline();

    const expr = parser.expression("Expected an expression after '='", (error) => {
      error.info('Add an expression after this =', parser.previous().span);
    });

    return new VariableDeclaration(
      identifier,
      variableType,
      expr,
      new Span(start, parser.previous().span.end),
    );
  }

  return new EmptyVariableDeclaration(
    identifier,
    variableType,
    new Span(start, parser.previous().span.end),
  );
}
