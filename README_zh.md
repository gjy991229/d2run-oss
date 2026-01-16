# D2Run Lite - 暗黑破坏神II 刷图计时器

简体中文 | [English](README.md)

一款轻量、优雅的桌面应用程序，专为暗黑破坏神II（Diablo II）速通和刷图设计，提供实时计时、掉落记录和统计分析功能。基于 Tauri, Vue 3 和 TypeScript 构建。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![CI](https://github.com/lllxxxlll/d2run/actions/workflows/ci.yml/badge.svg)

## ✨ 主要功能

- **⏱️ 实时计时**: 精确到秒的刷图计时。
- **💎 掉落记录**: 游戏过程中快速记录物品和符文掉落。
- **🌍 多语言支持**: 支持简体中文和英文界面。
- **📊 统计分析**: 追踪最佳时间、平均时间、总掉落数等详细数据。
- **🗺️ 场景追踪**: 支持所有暗黑II场景记录，并具备恐怖地带（Terror Zone）检测功能。
- **⌨️ 自定义快捷键**: 全键盘操作支持，所有快捷键均可自定义。
- **💾 本地数据存储**: 所有数据本地存储，保障隐私且速度极快。
- **🔥 恐怖地带支持**: 针对恐怖地带刷图的专属追踪。
- **📈 详细报表**: 查看掉落历史、运行统计和效率分析。

## 🚀 快速开始

### 前置要求

- Windows 10 或更高版本
- 约 100MB 磁盘空间

### 安装步骤

1. 从 [GitHub Releases](https://github.com/lllxxxlll/d2run/releases) 下载最新版本。
2. 运行安装程序。
3. 从开始菜单或桌面快捷方式启动 D2Run Lite。

### 基础使用

1. **开始刷图**: 点击主界面的 "开始刷图"。
2. **选择场景**: 选择你要刷的场景（如：地穴、女伯爵等）。
3. **记录掉落**: 游戏中按 `Alt+D` 打开掉落搜索框。
4. **结束统计**: 按下结束快捷键或点击 "结束统计" 完成本次记录。
5. **查看统计**: 点击 "历史记录" 查看详细的刷图分析。

## 🎮 键盘快捷键

| 动作 | 默认快捷键 | 功能 |
|--------|------------------|----------|
| **下一把** | `Alt+Right` | 保存当前记录并开始下一把 |
| **暂停/继续** | `Alt+Space` | 暂停或继续计时器 |
| **记录掉落** | `Alt+D` | 打开掉落搜索对话框 |
| **结束统计** | `Alt+End` | 结束当前的统计会话 |

> **注意**: 所有快捷键均可在设置菜单中进行自定义。

## 📊 统计功能

### 实时会话统计
- **场次 (#)**: 当前会话的刷图场次。
- **最快**: 当前会话的最快用时。
- **平均**: 当前会话的平均用时。

### 历史分析
- **总场次**: 累计刷图总数。
- **最快/最慢**: 历史最快和最慢记录。
- **总掉落**: 所有记录的掉落物品总数。
- **恐怖地带**: 恐怖地带专属场次统计。
- **场景分布**: 分场景的统计数据和平均用时。

### 掉落记录
- 支持中英文搜索物品。
- 支持自定义添加物品。
- 物品品质颜色区分显示。
- 完整的掉落历史记录，包含场景和场次信息。

## ☁️ 云同步与插件系统

本项目采用模块化架构，将核心开源应用与具体的云服务实现分离。

- **开源核心**: 基础应用包含云服务的桩实现 (`src/cloud/stub.ts`)。这使得应用可以在完全离线或使用开源兼容后端的模式下运行。
- **插件系统**: 实时云同步功能（如微信小程序集成）作为插件在 `src/cloud/impl` 目录下实现。
- **闭源插件**: 官方发布版本包含用于接入微信小程序**基德的私藏**的专有插件。该实现**不包含**在此开源仓库内。

### 开发自定义云插件

开发者可以通过以下步骤接入自己的云后端（如 Firebase, AWS, Supabase）：

1. 实现 `src/cloud/cloud.interface.ts` 中定义的 `ICloudService` 接口。
2. 将你的实现放置在 `src/cloud/impl` 或其他目录。
3. 更新 `src/cloud/index.ts` 以导出你的服务实例。

```typescript
// 示例: src/cloud/index.ts
export const cloudService = new MyCustomCloudService();
```

## 🛠️ 开发指南

### 环境配置

```bash
# 安装依赖
npm install

# 启动开发模式
npm run dev

# 构建生产版本
npm run build
```

### 项目结构

```
src/
├── components/         # Vue 组件
├── stores/             # Pinia 状态管理
│   └── runStore.ts     # 主要应用状态
├── shared/             # 共享工具和数据
│   ├── data.ts         # 物品和场景定义
│   ├── types.ts        # TypeScript 接口定义
│   └── converter.ts    # 数据转换工具
├── assets/             # 样式和静态资源
│   └── main.css        # 全局样式
└── App.vue             # 主应用组件

src-tauri/              # Rust 后端
├── src/
│   └── main.rs         # Tauri 窗口和命令处理
└── tauri.conf.json     # Tauri 配置文件
```

### 构建命令

```bash
# 开发环境
npm run dev           # 热重载开发服务器
npm run tauri dev     # 启动 Tauri应用开发模式

# 生产环境
npm run build         # 构建 Vue 应用
npm run tauri build   # 构建 Tauri 可执行文件
```

## 📋 配置说明

Windows 系统下配置存储在 `%APPDATA%/d2run/`：

- `config.json`: 用户首选项（快捷键、语言）。
- `runs.json`: 本地 SQLite 数据库，存储所有运行记录。
- `runs_cloud.json`: 云端同步的数据库，同步后存储所有运行记录。

## 📝 贡献

欢迎贡献代码！如有 bug 反馈或功能建议，请提交 Pull Request 或 Issue。

## 👨‍💻 作者

**lllxxxlll**

- QQ: 980102315
- GitHub: [@lllxxxlll](https://github.com/lllxxxlll)

## ☕ 支持

如果你喜欢 D2Run Lite 并想支持它的开发，可以：

- 在 GitHub 上给本项目点个 **Star**。
- 分享给你的暗黑破坏神社区。
- 反馈 Bug 或提出新功能建议。

## 📄 许可证

本项目基于 MIT 许可证开源 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- 感谢暗黑破坏神II社区的灵感和反馈。
- 感谢 [Tauri](https://tauri.app/) 团队提供的优秀框架。
- 感谢 [Vue.js](https://vuejs.org/) 社区提供的强大工具。

---

**Made with ❤️ for the Diablo II community**
