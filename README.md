# D2Run Lite - Diablo II Run Timer

[简体中文](README_zh.md) | English

A lightweight, elegant desktop application for tracking your Diablo II speedruns with real-time drop recording and statistics. Built with Tauri, Vue 3, and TypeScript.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![CI](https://github.com/lllxxxlll/d2run/actions/workflows/ci.yml/badge.svg)

## ✨ Features

- **⏱️ Real-time Timer**: Precise sub-second timing for your D2 runs.
- **💎 Drop Recording**: Quickly record items and runes as they drop during gameplay.
- **🌍 Multi-Language Support**: Fully localized in English and Simplified Chinese.
- **📊 Session Statistics**: Track best time, average time, total drops, and more.
- **🗺️ Scene-based Tracking**: Dedicated support for all Diablo II scenes with Terror Zone detection.
- **⌨️ Customizable Shortcuts**: Full keyboard customization for hands-free operation.
- **💾 Local Data Persistence**: All run data stored locally for privacy and speed.
- **🔥 Terror Zone Support**: Dedicated tracking for Terror Zone runs.
- **📈 Detailed Analytics**: View drop history, run statistics, and performance metrics.

## 🚀 Quick Start

### Prerequisites

- Windows 10 or later
- ~100MB disk space

### Download

> **📦 Pre-built Release vs Source Build**
> 
> | Version | Cloud Sync | How to Get |
> |---------|------------|------------|
> | **Pre-built Release** | ✅ Included | Download from [Releases](https://github.com/lllxxxlll/d2run/releases) |
> | **Build from Source** | ❌ Not included | Clone this repo and build yourself |
> 
> The pre-built release includes a proprietary cloud synchronization plugin for WeChat ecosystem integration. If you build from source, the app will work fully offline without cloud features.

1. Download the latest release from [GitHub Releases](https://github.com/lllxxxlll/d2run/releases).
2. Run the installer.
3. Launch D2Run Lite from your Start Menu or desktop shortcut.

### Basic Usage

1. **Start a Run**: Click "Start Run" on the home screen.
2. **Select Scene**: Choose your target scene (e.g., The Pit, Countess).
3. **Record Drops**: Press `Alt+D` during gameplay to open the drop search dialog.
4. **Finish Run**: Press your finish shortcut or click "Finish Run" to end the session.
5. **View Statistics**: Check "Logs" for detailed run analytics.

## 🎮 Keyboard Shortcuts

| Action | Default Shortcut | Function |
|--------|------------------|----------|
| **Next Run** | `Alt+Right` | Move to next run, save current |
| **Toggle Pause** | `Alt+Space` | Pause/resume timer |
| **Record Drop** | `Alt+D` | Open drop search dialog |
| **Finish Session** | `Alt+End` | End tracking session |

> **Note**: All shortcuts are fully customizable in the Settings menu.

## 📊 Tracking Features

### Real-time Session Stats
- **Runs (#)**: Current run count in this session.
- **Best**: Fastest run time this session.
- **Average**: Average run time this session.

### Historical Analytics
- **Total Runs**: Cumulative run count.
- **Best/Worst Time**: Your fastest and slowest runs.
- **Total Drops**: All recorded drops across runs.
- **Terror Zone Runs**: TZ-specific run count.
- **Scene Breakdown**: Per-scene statistics and averages.

### Drop Recording
- Search for drops by name (English or Chinese).
- Create custom items on-the-fly.
- Color-coded item rarity indicators.
- Full drop history with scene and run number tracking.

## ☁️ Cloud Synchronization & Plugin Architecture

This project is built with a modular architecture that separates the core open-source application from specific cloud implementations.

- **Open Source Core**: The base application includes a stub implementation (`src/cloud/studio.ts`) of the cloud service. It allows the app to function fully offline or with open-source compatible backends.
- **Plugin System**: Real-time cloud synchronization (e.g., WeChat Mini Program integration) is implemented as a plugin in `src/cloud/impl`.
- **Closed Source Plugin**: The official released version includes a proprietary plugin for WeChat ecosystem integration. This implementation is located in `src/cloud/impl` and is **not included** in this open-source repository.

### Developing Your Own Cloud Plugin

Developers can implement their own cloud synchronization backends (e.g., Firebase, AWS, Supabase) by:

1. Implementing the `ICloudService` interface defined in `src/cloud/cloud.interface.ts`.
2. Placing your implementation in a new directory or replacing the stub.
3. Updating `src/cloud/index.ts` to export your service instance.

```typescript
// Example: src/cloud/index.ts
export const cloudService = new MyCustomCloudService();
```

## 🛠️ Development

### Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── components/         # Vue components
├── stores/             # Pinia state management
│   └── runStore.ts     # Main application state
├── shared/             # Shared utilities and data
│   ├── data.ts         # Item and scene definitions
│   ├── types.ts        # TypeScript interfaces
│   └── converter.ts    # Data conversion utilities
├── assets/             # Styles and static assets
│   └── main.css        # Global styles and components
└── App.vue             # Main application component

src-tauri/              # Rust backend
├── src/
│   └── main.rs         # Tauri window and command handlers
└── tauri.conf.json     # Tauri configuration
```

### Build Commands

```bash
# Development
npm run dev           # Hot reload development server
npm run tauri dev     # Launch Tauri app in dev mode

# Production
npm run build         # Build Vue app
npm run tauri build   # Build Tauri executable
```

## 📋 Configuration

Settings are stored in `%APPDATA%/d2run/` on Windows:

- `config.json`: User preferences (shortcuts, language).
- `runs.db`: Local SQLite database with all run records.
- `runs_cloud.json`: Cloud sync data with all run records.

## 📝 Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and set up your development environment.

## 👨‍💻 Author

**lllxxxlll**

- QQ: 980102315
- GitHub: [@lllxxxlll](https://github.com/lllxxxlll)

## ☕ Support

If you enjoy D2Run Lite and want to support its development, consider:

- **Star** this repository on GitHub.
- **Share** with your D2 community.
- **Report bugs** and suggest features.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Diablo II community for inspiration and feedback.
- [Tauri](https://tauri.app/) team for the excellent framework.
- [Vue.js](https://vuejs.org/) community for amazing tools.

---

**Made with ❤️ for the Diablo II community**
