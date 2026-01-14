import Foundation

enum NavProvider: String, CaseIterable, Identifiable, Codable {
    case auto
    case apple
    case google
    case waze

    var id: String { rawValue }
}
