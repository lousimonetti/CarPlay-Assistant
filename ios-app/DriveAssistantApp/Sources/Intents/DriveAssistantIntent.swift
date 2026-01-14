import AppIntents

struct DriveAssistantIntent: AppIntent {
    static var title: LocalizedStringResource = "Drive Assistant"
    static var description = IntentDescription("Plan navigation and music using your configured backend, then open Maps and Music.")
    static var openAppWhenRun: Bool = true

    @Parameter(title: "Request")
    var request: String

    static var parameterSummary: some ParameterSummary {
        Summary("Drive with \.request")
    }

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let config = AssistantConfig()

        guard config.workerBaseURL != nil, config.hasToken else {
            return .result(dialog: "Open the Drive Assistant app and configure your Worker URL and token.")
        }

        let plan = try await WorkerClient.planDrive(utterance: request, config: config)
        PendingPlanStore.save(plan)

        let dialog = plan.spokenSummary ?? "Starting navigation and music."
        return .result(dialog: IntentDialog(stringLiteral: dialog))
    }
}
