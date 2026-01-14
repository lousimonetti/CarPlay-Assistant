import AppIntents

struct NavigateAssistantIntent: AppIntent {
    static var title: LocalizedStringResource = "Navigate Assistant"
    static var description = IntentDescription("Plan navigation using your configured backend, then open Maps.")
    static var openAppWhenRun: Bool = true

    @Parameter(title: "Destination / Request")
    var request: String

    static var parameterSummary: some ParameterSummary {
        Summary("Navigate with \.request")
    }

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let config = AssistantConfig()

        guard config.workerBaseURL != nil, config.hasToken else {
            return .result(dialog: "Open the Drive Assistant app and configure your Worker URL and token.")
        }

        let plan = try await WorkerClient.planNav(utterance: request, config: config)
        PendingPlanStore.save(plan)

        let dialog = plan.spokenSummary ?? "Starting navigation."
        return .result(dialog: IntentDialog(stringLiteral: dialog))
    }
}
