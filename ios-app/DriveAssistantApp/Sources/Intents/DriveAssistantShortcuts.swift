import AppIntents

struct DriveAssistantShortcuts: AppShortcutsProvider {
    static var shortcutTileColor: ShortcutTileColor = .blue

    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: DriveAssistantIntent(request: "Take me to the airport and play jazz"),
            phrases: [
                "Drive Assistant",
                "Drive with \(.applicationName)",
                "Ask \(.applicationName) to drive"
            ],
            shortTitle: "Drive",
            systemImageName: "car.fill"
        )

        AppShortcut(
            intent: NavigateAssistantIntent(request: "Take me to the nearest coffee shop"),
            phrases: [
                "Navigate Assistant",
                "Navigate with \(.applicationName)",
                "Ask \(.applicationName) to navigate"
            ],
            shortTitle: "Navigate",
            systemImageName: "map.fill"
        )
    }
}
