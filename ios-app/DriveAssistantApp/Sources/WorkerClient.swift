import Foundation

enum WorkerClient {
    static func planDrive(utterance: String, config: AssistantConfig) async throws -> PendingPlan {
        let base = try requireBaseURL(config)
        let token = try requireToken(config)

        let url = base.appendingPathComponent("plan/drive")
        let payload: [String: Any] = [
            "utterance": utterance,
            "country": "US",
            "locale": Locale.current.identifier,
            "nav_preference": config.navPreference.rawValue
        ]

        let data = try await postJSON(url: url, token: token, payload: payload)
        let resp = try JSONDecoder().decode(WorkerDriveResponse.self, from: data)

        return PendingPlan(
            spokenSummary: resp.spoken_summary,
            navURL: URL(string: resp.nav_url ?? ""),
            musicURL: URL(string: resp.music_url ?? ""),
            createdAt: Date()
        )
    }

    static func planNav(utterance: String, config: AssistantConfig) async throws -> PendingPlan {
        let base = try requireBaseURL(config)
        let token = try requireToken(config)

        let url = base.appendingPathComponent("plan/nav")
        let payload: [String: Any] = [
            "utterance": utterance,
            "country": "US",
            "locale": Locale.current.identifier,
            "nav_preference": config.navPreference.rawValue
        ]

        let data = try await postJSON(url: url, token: token, payload: payload)
        let resp = try JSONDecoder().decode(WorkerNavResponse.self, from: data)

        return PendingPlan(
            spokenSummary: resp.spoken_summary,
            navURL: URL(string: resp.nav_url ?? ""),
            musicURL: nil,
            createdAt: Date()
        )
    }

    private static func requireBaseURL(_ config: AssistantConfig) throws -> URL {
        guard let s = config.workerBaseURL, let u = URL(string: s) else {
            throw ClientError.misconfigured("Worker Base URL is not set.")
        }
        return u
    }

    private static func requireToken(_ config: AssistantConfig) throws -> String {
        guard let t = config.token, !t.isEmpty else {
            throw ClientError.misconfigured("Token is not set.")
        }
        return t
    }

    private static func postJSON(url: URL, token: String, payload: [String: Any]) async throws -> Data {
        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        req.setValue(token, forHTTPHeaderField: "X-Drive-Token")
        req.httpBody = try JSONSerialization.data(withJSONObject: payload, options: [])

        let (data, response) = try await URLSession.shared.data(for: req)
        if let http = response as? HTTPURLResponse, !(200...299).contains(http.statusCode) {
            throw ClientError.http(http.statusCode)
        }
        return data
    }

    enum ClientError: LocalizedError {
        case misconfigured(String)
        case http(Int)

        var errorDescription: String? {
            switch self {
            case .misconfigured(let msg): return msg
            case .http(let code): return "Server returned HTTP \(code)."
            }
        }
    }
}
