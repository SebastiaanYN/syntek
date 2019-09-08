import { testRule } from '../rule-tester';

import { invalidControlStatement } from '../../../src/linter/rules/parser/invalid-control-statement';

const RETURN_ERROR = 'You can only place return inside a function';
const BREAK_ERROR = 'You can only place break inside a loop or switch case';
const CONTINUE_ERROR = 'You can only place continue inside a loop';
const FALLTHROUGH_ERROR = 'You can only place fallthrough inside a switch case';

testRule('invalidControlStatement', invalidControlStatement, {
  valid: [
    // Return
    'function x() \n\t return',
    'function x() \n\t if y \n\t\t return',
    'if x \n\t function x() \n\t\t return',
    'class C \n\t function x() \n\t\t return',

    // Break
    'for x in y \n\t break',
    'for x in y \n\t if z \n\t\t break',
    'if x \n\t for y in z \n\t\t break',
    'switch x \n\t case y \n\t\t break',

    // Continue
    'for x in y \n\t continue',
    'for x in y \n\t if z \n\t\t continue',
    'if x \n\t for y in z \n\t\t continue',

    // Fallthrough
    'switch x \n\t case y \n\t\t fallthrough',
  ],
  invalid: [
    // Return
    { code: 'return', errors: [RETURN_ERROR] },
    { code: 'if x \n\t return', errors: [RETURN_ERROR] },
    { code: 'for x in y \n\t return', errors: [RETURN_ERROR] },
    { code: 'switch x \n\t case y \n\t\t return', errors: [RETURN_ERROR] },

    // Break
    { code: 'break', errors: [BREAK_ERROR] },
    { code: 'if x \n\t break', errors: [BREAK_ERROR] },
    { code: 'function x() \n\t break', errors: [BREAK_ERROR] },

    // Continue
    { code: 'continue', errors: [CONTINUE_ERROR] },
    { code: 'if x \n\t continue', errors: [CONTINUE_ERROR] },
    { code: 'function x() \n\t continue', errors: [CONTINUE_ERROR] },
    { code: 'switch x \n\t case y \n\t\t continue', errors: [CONTINUE_ERROR] },

    // Fallthrough
    { code: 'fallthrough', errors: [FALLTHROUGH_ERROR] },
    { code: 'if x \n\t fallthrough', errors: [FALLTHROUGH_ERROR] },
    { code: 'for x in y \n\t fallthrough', errors: [FALLTHROUGH_ERROR] },
    { code: 'function x() \n\t fallthrough', errors: [FALLTHROUGH_ERROR] },
  ],
});