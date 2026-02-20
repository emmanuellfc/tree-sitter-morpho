; Literals
(integer) @number
(float) @number
(string) @string
(boolean) @constant.builtin
(nil) @constant.builtin

; Identifiers
(identifier) @variable

; Keywords
[
  "fn"
  "var"
  "if"
  "else"
  "return"
  "print"
  "for"
  "in"
  "while"
  "do"
  "break"
  "continue"
  "class"
  "is"
  "with"
] @keyword

; Classes
(class_declaration
  name: (identifier) @type)

; Function Definitions
(function_definition
  name: (identifier) @function)

(function_expression
  name: (identifier) @function)

; Comments
(line_comment) @comment
(block_comment) @comment
