import XCTest
import SwiftTreeSitter
import TreeSitterMorpho

final class TreeSitterMorphoTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_morpho())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Morpho grammar")
    }
}
