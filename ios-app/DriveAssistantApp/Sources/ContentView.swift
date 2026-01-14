import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var config: AssistantConfig

    var body: some View {
        NavigationStack {
            List {
                Section("Status") {
                    LabeledContent("Worker URL", value: config.workerBaseURL ?? "(not set)")
                    LabeledContent("Token", value: config.hasToken ? "Stored" : "(not set)")
                    LabeledContent("Default nav", value: config.navPreference.rawValue)
                }

                Section("Try it") {
                    Text("Invoke Siri: “Drive Assistant” or “Navigate Assistant”. The app will open briefly to execute navigation/music, then hand off to Maps/Music.")
                        .font(.footnote)
                }
            }
            .navigationTitle("Drive Assistant")
        }
    }
}
