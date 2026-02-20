/**
 * @file A simple tree-sitter parser for Morpho
 * @author Emmanuel Flores <eq.emmanuel.137@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
  name: "morpho",

  extras: ($) => [/\s/, $.comment],

  conflicts: ($) => [
    [$.dictionary, $.block],
    [$.function_definition, $.function_expression]
  ],

  word: ($) => $.identifier,

  rules: {

    source_file: ($) => repeat($._statement),

    // Comments
    comment: ($) => choice($.line_comment, $.block_comment),

    line_comment: ($) => token(seq("//", /.*/)),

    block_comment: ($) => token(seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),

    // Statements
    _statement: ($) =>
      choice(
        $.expression_statement,
        $.declaration_statement,
        $.print_statement,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.do_while_statement,
        $.return_statement,
        $.break_statement,
        $.continue_statement,
        $.block,
        $.import_statement,
        $.try_statement,
        $.function_definition,
        $.class_declaration,
      ),

    expression_statement: ($) => seq($._expression, choice(";", "\n")),

    declaration_statement: ($) =>
      seq("var", commaSep1($.variable_declaration), choice(";", "\n")),

    variable_declaration: ($) =>
      seq($.identifier, optional(seq("=", $._expression))),

    print_statement: ($) => seq("print", $._expression, choice(";", "\n")),

    block: ($) => seq("{", repeat($._statement), "}"),

    if_statement: ($) =>
      prec.right(
        seq(
          "if",
          "(",
          $._expression,
          ")",
          $._statement,
          optional(seq("else", $._statement)),
        ),
      ),

    while_statement: ($) => seq("while", "(", $._expression, ")", $._statement),

    for_statement: ($) =>
      seq(
        "for",
        "(",
        choice(
          seq(
            optional($._expression),
            ";",
            optional($._expression),
            ";",
            optional($._expression),
          ),
          seq($.identifier, "in", $._expression),
        ),
        ")",
        $._statement,
      ),

    do_while_statement: ($) =>
      seq(
        "do",
        $._statement,
        "while",
        "(",
        $._expression,
        ")",
        choice(";", "\n"),
      ),

    return_statement: ($) =>
      seq("return", optional($._expression), choice(";", "\n")),

    break_statement: ($) => seq("break", choice(";", "\n")),

    continue_statement: ($) => seq("continue", choice(";", "\n")),

    import_statement: ($) =>
      seq(
        "import",
        choice($.string, $.identifier),
        optional(seq("for", commaSep1($.identifier))),
        optional(seq("as", $.identifier)),
        choice(";", "\n"),
      ),

    try_statement: ($) =>
      seq("try", $._statement, "catch", "{", repeat($.catch_handler), "}"),

    catch_handler: ($) =>
      seq($.string, optional(seq("with", $.identifier)), $._statement),

    function_definition: ($) =>
      prec.right(seq(
        "fn",
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        $.block,
      )),

    parameter_list: ($) => commaSep1($.parameter),

    // In Morpho, a parameter can have an optional type BEFORE the identifier: `String text` or just `text`
    parameter: ($) =>
      seq(
        optional("..."),
        optional($.type),
        $.identifier,
        optional(seq("=", $._expression))
      ),

    // Expressions
    _expression: ($) =>
      choice(
        $.primary_expression,
        $.unary_expression,
        $.binary_expression,
        $.ternary_expression,
        $.assignment_expression,
        $.call_expression,
        $.index_expression,
        $.member_expression,
        $.function_expression,
      ),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.integer,
        $.float,
        $.imaginary,
        $.string,
        $.boolean,
        $.nil,
        $.self,
        $.super,
        $.list,
        $.dictionary,
        $.symbol,
        $.parenthesized_expression,
      ),

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    unary_expression: ($) =>
      prec(14, seq(choice("-", "!", "@"), $._expression)),

    binary_expression: ($) => {
      const table = [
        [16, "^"],
        [13, choice("*", "/")],
        [12, choice("+", "-")],
        [10, ".."],
        [10, "..."],
        [9, choice("<", ">", "<=", ">=")],
        [8, choice("==", "!=")],
        [7, choice("&&", "and")],
        [6, choice("||", "or")],
        [15, "."],
      ];

      return choice(
        ...table.map(([precedence, operator]) =>
          prec.left(precedence, seq($._expression, operator, $._expression)),
        ),
      );
    },

    ternary_expression: ($) =>
      prec.right(4, seq($._expression, "?", $._expression, ":", $._expression)),

    assignment_expression: ($) =>
      prec.right(
        3,
        seq($._expression, choice("=", "+=", "-=", "*=", "/="), $._expression),
      ),

    call_expression: ($) =>
      prec(
        15,
        seq($._expression, "(", optional(commaSep1($._expression)), ")"),
      ),

    index_expression: ($) =>
      prec(15, seq($._expression, "[", $._expression, "]")),

    member_expression: ($) => prec(15, seq($._expression, ".", $.identifier)),

    function_expression: ($) =>
      seq(
        "fn",
        optional(field("name", $.identifier)),
        "(",
        optional($.parameter_list),
        ")",
        $.block,
      ),

    // Class declaration
    class_declaration: ($) =>
      seq(
        "class",
        field("name", $.identifier),
        optional(seq("is", $.identifier)),
        optional(seq("with", commaSep1($.identifier))),
        "{",
        repeat(choice($.method_declaration, $.variable_declaration)),
        "}",
      ),

    method_declaration: ($) =>
      seq(
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        $.block,
      ),

    // Literals
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    type: ($) => /[A-Z][a-zA-Z0-9_]*/, // Convention: Types usually start with uppercase

    integer: ($) => /[0-9]+/,

    float: ($) => /[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/,

    imaginary: ($) => seq(choice($.integer, $.float), choice("im", "i")),

    string: ($) =>
      seq(
        '"',
        repeat(
          choice(
            token.immediate(prec(1, /[^"\\$\n]+/)),
            $.escape_sequence,
            $.interpolation,
          ),
        ),
        '"',
      ),

    interpolation: ($) => seq("${", $._expression, "}"),

    escape_sequence: ($) =>
      token.immediate(
        seq(
          "\\",
          choice(
            /[\\'"nrt]/,
            /x[0-9a-fA-F]{2}/,
            /u[0-9a-fA-F]{4}/,
            /U[0-9a-fA-F]{8}/,
          ),
        ),
      ),

    boolean: ($) => choice("true", "false"),

    nil: ($) => "nil",

    self: ($) => "self",

    super: ($) => seq("super", ".", $.identifier),

    symbol: ($) => seq(":", $.identifier),

    list: ($) => seq("[", optional(commaSep1($._expression)), "]"),

    dictionary: ($) => seq("{", optional(commaSep1($.dictionary_entry)), "}"),

    dictionary_entry: ($) => seq($._expression, ":", $._expression),
  },
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)), optional(","));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
