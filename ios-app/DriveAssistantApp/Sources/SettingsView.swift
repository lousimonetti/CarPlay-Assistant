import SwiftUI

struct SettingsView: View {
    @EnvironmentObject private var config: AssistantConfig
    @State private var workerUrlText: String = ""
    @State private var tokenText: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Backend") {
                    TextField("Worker Base URL (https://...)", text: $workerUrlText)
                        .textInputAutocapitalization(.never)
                        .keyboardType(.URL)
                        .autocorrectionDisabled()

                    SecureField("Shortcut Token", text: $tokenText)
                        .textInputAutocapitalization(.never)
                        .autocorrectionDisabled()

                    Button("Save") {
                        let url = workerUrlText.trimmingCharacters(in: .whitespacesAndNewlines)
                        config.workerBaseURL = url.isEmpty ? nil : url

                        let tok = tokenText.trimmingCharacters(in: .whitespacesAndNewlines)
                        if !tok.isEmpty { config.token = tok }
                        tokenText = ""
                    }
                }

                Section("Defaults") {
                    Picker("Nav provider", selection: $config.navPreference) {
                        ForEach(NavProvider.allCases) { p in
                            Text(p.rawValue).tag(p)
                        }
                    }
                }

                Section("Notes") {
                    Text("This app provides App Shortcuts via App Intents. Siri triggers the intent; the app executes the plan by opening Maps/Music URLs.")
                        .font(.footnote)
                }
            }
            .navigationTitle("Settings")
            .onAppear {
                workerUrlText = config.workerBaseURL ?? ""
            }
        }
    }
}
