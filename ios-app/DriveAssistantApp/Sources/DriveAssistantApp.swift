import SwiftUI

@main
struct DriveAssistantApp: App {
    @StateObject private var config = AssistantConfig()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(config)
        }
    }
}
