import Foundation
import UIKit

enum PendingPlanExecutor {
    static func executeIfNeeded() async {
        guard let plan = PendingPlanStore.load() else { return }
        PendingPlanStore.clear()

        if let nav = plan.navURL {
            await open(nav)
            try? await Task.sleep(nanoseconds: 900_000_000)
        }
        if let music = plan.musicURL {
            await open(music)
        }
    }

    @MainActor
    private static func open(_ url: URL) async {
        UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }
}
