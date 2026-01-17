# D2Run Lite - 暗黑破坏神II 刷图计时器

简体中文 | [English](README.md)

一款轻量、优雅的桌面应用程序，专为暗黑破坏神II（Diablo II）速刷玩家设计，提供强大的统计和云同步功能。

![Version](https://img.shields.io/badge/version-0.1.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://github.com/gjy991229/d2run-oss/workflows/ci.yml/badge.svg)

## ✨ 功能特性

- **计时器**: 精确追踪你的暗黑破坏神II刷图时间。
- **掉落追踪**: 记录游戏中掉落的有价值物品。
- **统计分析**: 查看掉落历史、刷图统计和性能指标。
- **场景选择**: 选择不同的游戏场景（如：地穴、女伯爵等）。
- **快捷键**: 完全可自定义的热键设置。
- **云同步**: 跨设备同步数据（需要云插件）。

## 🚀 快速开始

### 安装

1. 从 [GitHub Releases](https://github.com/gjy991229/d2run-oss/releases) 下载最新版本。
2. 运行安装程序并按照提示操作。
3. 从开始菜单或桌面启动 D2Run Lite。

### 基本使用

1. **开始刷图**: 点击主界面的 "开始刷图"。
2. **选择场景**: 选择一个场景（如：地穴、女伯爵等）。
3. **追踪掉落**: 记录任何有价值的掉落物品。
4. **结束统计**: 按下结束快捷键或点击 "结束统计" 完成本次记录。
5. **查看统计**: 点击 "历史记录" 查看详细的刷图分析。

## 🎮 快捷键

| 操作 | 默认快捷键 | 描述 |
|------|-----------|------|
| **下一抛** | `Alt+S` | 保存当前记录并开始下一抛 |
| **暂停/继续** | `Alt+Space` | 暂停或继续计时器 |
| **打开掉落搜索** | `Alt+D` | 打开掉落搜索对话框 |
| **结束会话** | `Alt+End` | 结束当前的统计会话 |

> **注意**: 所有快捷键均可在设置菜单中进行自定义。

## 📊 统计数据

- **最快**: 当前会话的最快用时。
- **平均**: 当前会话的平均用时。
- **总掉落**: 追踪总掉落数等详细数据。

## 🔌 云同步

- **闭源插件**: 官方发布版本包含用于接入微信小程序云同步的插件。该实现**不包含**在本开源仓库内。
- **开放接口**: 你可以通过以下方式实现自己的云同步：
  1. 实现 `src/cloud/cloud.interface.ts` 中定义的 `ICloudService` 接口。
  2. 将实现放在 `src/cloud/impl` 或其他目录。
  3. 更新 `src/cloud/index.ts` 以导出你的服务实例。

这允许你接入任何云后端（如：Firebase, AWS, Supabase）。

```typescript
// 示例：导出你的自定义实现
import { MyCloudService } from './impl/myCloudService';
export const cloudService = new MyCloudService();
```

## 🛠️ 开发指南

### 环境配置

```bash
# 克隆仓库
git clone https://github.com/gjy991229/d2run-oss.git
cd d2run-oss

# 安装依赖
npm install

# 启动开发模式
npm run tauri dev

# 构建生产版本
npm run tauri build
```

### 项目结构

```
src/
├── components/         # Vue 组件
├── stores/             # Pinia 状态管理
│   └── runStore.ts     # 主程序状态
├── cloud/              # 云同步接口
│   ├── cloud.interface.ts  # 接口定义
│   ├── stub.ts         # 存根实现
│   └── index.ts        # 服务导出
└── App.vue             # 主应用
```

## 🤝 贡献

查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何提交 Pull Request、报告问题以及设置开发环境。

## 📄 许可证

本项目基于 MIT 许可证开源 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 👨‍💻 作者

**lllxxxlll**
- QQ: 980102315
- GitHub: [@gjy991229](https://github.com/gjy991229)

## 🙏 致谢

- 感谢暗黑破坏神II社区的灵感和反馈。
- 感谢 [Tauri](https://tauri.app/) 团队提供的优秀框架。
- 感谢 [Vue.js](https://vuejs.org/) 社区提供的强大工具。

---

## ⭐ 支持

如果你喜欢 D2Run Lite 并想支持它的开发，可以：

- 在 GitHub 上给本项目点一个 **Star**。
- 分享给你的暗黑破坏神社区。
- 反馈 Bug 或提出新功能建议。

---

**Made with ❤️ for the Diablo II community**
