import 'mocha';
import { expect } from 'chai';

import { parse } from '../test-utils';

import { ASTWalker } from '../../src/walker/ASTWalker';
import { WalkerContext } from '../../src/walker/WalkerContext';

import * as grammar from '../../src/grammar';
import { Node } from '../../src/grammar/Node';

describe('ASTWalker', () => {
  const program = parse('10 + 2 * 5');

  it('calls the callbacks on enter', () => {
    const array: Node[] = [];
    let parentCount = 0;

    function walkerCB(node: Node, context: WalkerContext): void {
      array.push(node);

      expect(context.parents.length).to.equal(parentCount);
      parentCount += 1;
    }

    new ASTWalker(program)
      .onEnter(grammar.Program, walkerCB)
      .onEnter(grammar.ExpressionStatement, walkerCB)
      .onEnter(grammar.BinaryExpression, walkerCB)
      .walk();

    expect(parentCount).to.equal(4);
    expect(array.length).to.equal(4);
    expect(array).to.deep.equal([
      program,
      program.body[0],
      (program.body[0] as any).expression,
      (program.body[0] as any).expression.right,
    ]);
  });

  it('calls the callbacks on leave', () => {
    const array: Node[] = [];
    let parentCount = 3;

    function walkerCB(node: Node, context: WalkerContext): void {
      array.push(node);

      expect(context.parents.length).to.equal(parentCount);
      parentCount -= 1;
    }

    new ASTWalker(program)
      .onLeave(grammar.Program, walkerCB)
      .onLeave(grammar.ExpressionStatement, walkerCB)
      .onLeave(grammar.BinaryExpression, walkerCB)
      .walk();

    expect(parentCount).to.equal(-1);
    expect(array.length).to.equal(4);
    expect(array).to.deep.equal([
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression,
      program.body[0],
      program,
    ]);
  });

  it('calls the callbacks when both enter and leave are provided', () => {
    const array: Node[] = [];
    let parentCount = 0;

    function walkerCB(node: Node, context: WalkerContext, enter: boolean): void {
      array.push(node);

      if (!enter) {
        parentCount -= 1;
      }

      expect(context.parents.length).to.equal(parentCount);

      if (enter) {
        parentCount += 1;
      }
    }

    const onEnter = (node: Node, context: WalkerContext): void => walkerCB(node, context, true);
    const onLeave = (node: Node, context: WalkerContext): void => walkerCB(node, context, false);

    new ASTWalker(program)
      .onEnter(grammar.Program, onEnter)
      .onLeave(grammar.Program, onLeave)
      .onEnter(grammar.ExpressionStatement, onEnter)
      .onLeave(grammar.ExpressionStatement, onLeave)
      .onEnter(grammar.BinaryExpression, onEnter)
      .onLeave(grammar.BinaryExpression, onLeave)
      .walk();

    expect(parentCount).to.equal(0);
    expect(array.length).to.equal(8);
    expect(array).to.deep.equal([
      program,
      program.body[0],
      (program.body[0] as any).expression,
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression.right,
      (program.body[0] as any).expression,
      program.body[0],
      program,
    ]);
  });

  it('provides the correct scope');
});
