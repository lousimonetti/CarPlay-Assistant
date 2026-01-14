import Foundation

struct WorkerDriveResponse: Codable {
    let spoken_summary: String?
    let nav_url: String?
    let music_url: String?
}

struct WorkerNavResponse: Codable {
    let spoken_summary: String?
    let nav_url: String?
}

struct PendingPlan: Codable {
    let spokenSummary: String?
    let navURL: URL?
    let musicURL: URL?
    let createdAt: Date
}
