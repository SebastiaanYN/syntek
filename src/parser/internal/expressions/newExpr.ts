import {
  Node, Token, LexicalToken, VariableType, NewExpression,
} from '../../../grammar';

import { Parser } from '../..';
import { Span } from '../../../position';
import { Precedence } from '../../Precedence';
import { matchGenericArgs, matchExpressionList } from '../../parse-utils';

import { memberExpr } from './memberExpr';

export function newExpr(parser: Parser, prefix: Token): Node {
  const start = prefix.span.start;

  parser.ignoreNewline();

  let object = parser.parsePrecedence(Precedence.OP11, "Expected an expression after 'new'", (error) => {
    error.info('Add an expression after this new', prefix.span);
  });

  parser.ignoreNewline();

  while (parser.match(LexicalToken.DOT)) {
    object = memberExpr(parser, object, parser.previous());
  }

  parser.ignoreNewline();

  let genericArgs: VariableType[] = [];
  if (parser.match(LexicalToken.LT)) {
    genericArgs = matchGenericArgs(parser);
    parser.ignoreNewline();
  }

  parser.consume(LexicalToken.L_PAR, "Expected '(' after the class", (error) => {
    error.info("Add a '(' after this class", object.span);
  });
  const params = matchExpressionList(parser, LexicalToken.R_PAR);

  return new NewExpression(
    object,
    genericArgs,
    params,
    new Span(start, parser.previous().span.end),
  );
}
