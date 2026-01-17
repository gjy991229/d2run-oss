# D2Run Lite - Diablo II Run Timer

[简体中文](README_zh.md) | English

A lightweight, elegant desktop application for tracking your Diablo II speedruns with powerful statistics and cloud sync capabilities.

![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://github.com/gjy991229/d2run-oss/workflows/ci.yml/badge.svg)

## ✨ Features

- **Run Timer**: Track your Diablo II runs with precision timing.
- **Drop Tracking**: Record valuable items they drop during gameplay.
- **Run Statistics**: View drop history, run statistics, and performance metrics.
- **Scene Selection**: Choose different game scenes (e.g., Pits, Countess).
- **Keyboard Shortcuts**: Fully customizable hotkeys for quick actions.
- **Cloud Sync**: Sync your data across devices (requires cloud plugin).

## 🚀 Quick Start

### Installation

1. Download the latest release from [GitHub Releases](https://github.com/gjy991229/d2run-oss/releases).
2. Run the installer and follow the prompts.
3. Launch D2Run Lite from your Start Menu or Desktop.

### Basic Usage

1. **Start Run**: Click "Start Run" on the main interface.
2. **Select Scene**: Choose a scene (e.g., Pits, Countess).
3. **Track Drops**: Record any valuable items that drop.
4. **Finish Run**: Press the end hotkey or click "Finish Run" to end the session.
5. **View Statistics**: Click "History" to view detailed run analysis.

## 🎮 Keyboard Shortcuts

| Action | Default Shortcut | Description |
|--------|-----------------|-------------|
| **Next Run** | `Alt+S` | Save current record and start next run |
| **Toggle Pause** | `Alt+Space` | Pause/resume timer |
| **Open Drop Search** | `Alt+D` | Open drop search dialog |
| **End Session** | `Alt+End` | End current statistics session |

> **Note**: All shortcuts are fully customizable in the Settings menu.

## 📊 Statistics

- **Fastest**: The fastest run time in current session.
- **Average**: The average run time in current session.
- **Total Drops**: Track total drops and detailed statistics.

## 🔌 Cloud Sync

- **Closed Source Plugin**: The official release version contains a proprietary plugin for WeChat Mini Program cloud sync. This implementation is **not included** in this open source repository.
- **Open Interface**: You can implement your own cloud sync by:
  1. Implementing the `ICloudService` interface defined in `src/cloud/cloud.interface.ts`.
  2. Placing your implementation in `src/cloud/impl` or other directory.
  3. Updating `src/cloud/index.ts` to export your service instance.

This allows you to integrate with any cloud backend (e.g., Firebase, AWS, Supabase).

```typescript
// Example: Export your custom implementation
import { MyCloudService } from './impl/myCloudService';
export const cloudService = new MyCloudService();
```

## 🛠️ Development

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/gjy991229/d2run-oss.git
cd d2run-oss

# Install dependencies
npm install

# Start development mode
npm run tauri dev

# Build for production
npm run tauri build
```

### Project Structure

```
src/
├── components/         # Vue components
├── stores/             # Pinia state management
│   └── runStore.ts     # Main application state
├── cloud/              # Cloud sync interface
│   ├── cloud.interface.ts  # Interface definition
│   ├── stub.ts         # Stub implementation
│   └── index.ts        # Service export
└── App.vue             # Main application
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and set up your development environment.

## 📄 License

This project is open sourced under MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**lllxxxlll**
- QQ: 980102315
- GitHub: [@gjy991229](https://github.com/gjy991229)

## 🙏 Acknowledgments

- Diablo II community for inspiration and feedback.
- [Tauri](https://tauri.app/) team for the excellent framework.
- [Vue.js](https://vuejs.org/) community for amazing tools.

---

## ⭐ Support

If you enjoy D2Run Lite and want to support its development, consider:

- Giving this project a **Star** on GitHub.
- Sharing with your Diablo II community.
- Reporting bugs or suggesting new features.

---

**Made with ❤️ for the Diablo II community**
