import SwiftUI

struct RootView: View {
    @EnvironmentObject private var config: AssistantConfig
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        TabView {
            ContentView()
                .tabItem { Label("Home", systemImage: "car") }

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .onChange(of: scenePhase) { _, phase in
            guard phase == .active else { return }
            Task { await PendingPlanExecutor.executeIfNeeded() }
        }
        .task {
            await PendingPlanExecutor.executeIfNeeded()
        }
    }
}
