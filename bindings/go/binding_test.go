package tree_sitter_morpho_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_morpho "github.com/tree-sitter/tree-sitter-morpho/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_morpho.Language())
	if language == nil {
		t.Errorf("Error loading Morpho grammar")
	}
}
