// swift-tools-version:5.3

import Foundation
import PackageDescription

var sources = ["src/parser.c"]
if FileManager.default.fileExists(atPath: "src/scanner.c") {
    sources.append("src/scanner.c")
}

let package = Package(
    name: "TreeSitterMorpho",
    products: [
        .library(name: "TreeSitterMorpho", targets: ["TreeSitterMorpho"]),
    ],
    dependencies: [
        .package(name: "SwiftTreeSitter", url: "https://github.com/tree-sitter/swift-tree-sitter", from: "0.9.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterMorpho",
            dependencies: [],
            path: ".",
            sources: sources,
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterMorphoTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterMorpho",
            ],
            path: "bindings/swift/TreeSitterMorphoTests"
        )
    ],
    cLanguageStandard: .c11
)
