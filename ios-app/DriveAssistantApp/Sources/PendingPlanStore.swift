import Foundation

enum PendingPlanStore {
    private static let key = "PendingPlanJSON"

    static func save(_ plan: PendingPlan) {
        if let data = try? JSONEncoder().encode(plan) {
            UserDefaults.standard.set(data, forKey: key)
        }
    }

    static func load() -> PendingPlan? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        return try? JSONDecoder().decode(PendingPlan.self, from: data)
    }

    static func clear() {
        UserDefaults.standard.removeObject(forKey: key)
    }
}
