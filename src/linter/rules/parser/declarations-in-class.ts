import * as grammar from '../../../grammar';

import { LinterRule } from '../..';
import { Level } from '../../../diagnostic';

export const declarationsInClass: LinterRule = {
  description: 'Report when an expression or statement is in a class body',
  level: Level.ERROR,
  create(walker, report) {
    function checkNode(node: grammar.Node): void {
      if (!grammar.isDeclaration(node)) {
        report('You can only put declarations in a class body', node.span);
      }
    }

    walker.onEnter(grammar.ClassDeclaration, (node) => {
      node.staticBody.forEach(prop => checkNode(prop.value));
      node.instanceBody.forEach(prop => checkNode(prop.value));
    });
  },
};
