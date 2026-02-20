# tree-sitter-morpho

A Tree-sitter grammar and syntax highlighting parser for the [Morpho](https://github.com/morpho-lang/morpho) programming language.

## Features

- Complete parser for Morpho syntax (classes, functions, loops, variables, etc.)
- Syntax highlighting queries (`queries/highlights.scm`) for IDE integration.

## Installation

### Neovim (nvim-treesitter)

To use this grammar in Neovim, you can add the following to your `init.lua` to configure the parser:

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.morpho = {
  install_info = {
    url = "https://github.com/emmanuellfc/tree-sitter-morpho",
    files = {"src/parser.c"},
    branch = "main",
  },
  filetype = "morpho",
}
```

### Zed

Since Zed uses Tree-sitter for all its language parsing, you can create a Zed extension that points to this repository!

## Contributing

1. Fork the repository
2. Modify `grammar.js` or `queries/highlights.scm`
3. Run `npm run build` or `tree-sitter generate`
4. Test your changes with `tree-sitter highlight example.morpho`

## License

MIT

## Acknowledgements

This project was developed with the assistance of AI, specifically using Gemini 3.1 with Antigravity, to help build and refine the syntax and parser rules.
