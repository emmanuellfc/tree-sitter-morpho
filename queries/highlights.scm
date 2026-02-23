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

; Literal Self Keyword
(self) @variable.builtin

; Classes
(class_declaration
  name: (identifier) @type)

; Function and Method Definitions
(function_definition
  name: (identifier) @function)

(function_expression
  name: (identifier) @function)

(method_declaration
  name: (identifier) @function.method)

(member_expression
  (identifier) @property)

; Comments
(line_comment) @comment
(block_comment) @comment
