export enum SyntacticToken {
  // Declarations
  VARIABLE_DECL,
  FUNCTION_DECL,
  CLASS_DECL,
  IMPORT_DECL,

  // Expressions
  WRAPPED_EXPR,
  UNARY_EXPR,
  BINARY_EXPR,
  CALL_EXPR,
  INDEX_EXPR,
  MEMBER_EXPR,
  NEW_EXPR,
  INSTANCEOF_EXPR,
  ASYNC_EXPR,
  ARRAY_EXPR,
  OBJECT_EXPR,

  IDENTIFIER,
  LITERAL,
  SUPER,
  THIS,

  // Statements
  IF_STMT,
  SWITCH_STMT,
  FOR_STMT,
  REPEAT_STMT,
  WHILE_STMT,
  TRY_STMT,
  THROW_STMT,
  RETURN_STMT,
  EXPRESSION_STMT,

  // Program
  PROGRAM,
}
