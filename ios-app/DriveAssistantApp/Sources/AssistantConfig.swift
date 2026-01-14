import Foundation
import Combine

final class AssistantConfig: ObservableObject {
    private enum Keys {
        static let workerBaseURL = "workerBaseURL"
        static let navPreference = "navPreference"
        static let tokenKeychainAccount = "DriveAssistantToken"
    }

    @Published var workerBaseURL: String? {
        didSet { UserDefaults.standard.set(workerBaseURL, forKey: Keys.workerBaseURL) }
    }

    @Published var navPreference: NavProvider {
        didSet { UserDefaults.standard.set(navPreference.rawValue, forKey: Keys.navPreference) }
    }

    init() {
        self.workerBaseURL = UserDefaults.standard.string(forKey: Keys.workerBaseURL)
        let pref = UserDefaults.standard.string(forKey: Keys.navPreference) ?? NavProvider.auto.rawValue
        self.navPreference = NavProvider(rawValue: pref) ?? .auto
    }

    var hasToken: Bool {
        (try? Keychain.read(account: Keys.tokenKeychainAccount)) != nil
    }

    var token: String? {
        get { try? Keychain.read(account: Keys.tokenKeychainAccount) }
        set {
            if let v = newValue, !v.isEmpty {
                try? Keychain.save(account: Keys.tokenKeychainAccount, value: v)
            }
        }
    }
}
