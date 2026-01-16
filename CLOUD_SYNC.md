# D2Run 云同步模块说明

## 概述

D2Run 支持可选的云数据同步功能，采用模块化插件架构设计。此功能允许用户通过微信小程序扫码登录，并将本地刷图记录同步到云端。

## 架构设计

```
src/cloud/
├── cloud.interface.ts   # 接口定义（必需）
├── cloud.stub.ts        # 空实现（开源默认）
├── index.ts             # 模块入口
├── README.md            # 模块文档
└── impl/                # 完整实现（闭源，gitignore）
    ├── auth.service.ts  # 认证服务
    ├── cloud.service.ts # 同步服务
    ├── converter.ts     # 数据转换
    └── cloud.impl.ts    # 实现导出
```

### 运行时行为

1. 应用启动时，`index.ts` 尝试动态导入 `impl/cloud.impl.ts`
2. 如果成功，启用完整云同步功能
3. 如果失败（文件不存在），回退到 `cloud.stub.ts`（空实现）

## 开源版本

开源版本不包含 `src/cloud/impl/` 目录，因此：
- 云同步功能不可用
- 设置页面显示"云同步不可用"提示
- 本地功能完全正常
- 编译不会报错

## 启用云同步

要启用云同步功能：

### 1. 安装依赖

```bash
npm install @cloudbase/js-sdk qrcode
npm install -D @types/qrcode
```

### 2. 创建实现文件

在 `src/cloud/impl/` 目录下创建以下文件（参考已有模板）：

- `auth.service.ts` - 修改 `ENV_ID` 为你的 Cloudbase 环境 ID
- `cloud.service.ts`
- `converter.ts`
- `cloud.impl.ts`

### 3. 配置云函数

在你的 Cloudbase 环境中部署以下云函数：
- `electron_auth` - 处理登录码生成和验证
- `manageRunStats` - 处理刷图数据同步
- `saveUserEquipment` - 保存装备掉落数据（可选）

## 同步机制

### 数据流程

1. **上传**：本地记录 → 转换为云格式 → 批量上传
2. **下载**：云端记录 → 转换为本地格式 → 缓存到 localStorage
3. **合并**：历史页面显示本地 + 云端合并数据

### 冷却时间

同步操作有 1 小时冷却时间，防止频繁请求。

## 接口定义

完整接口定义见 `cloud.interface.ts`：

```typescript
interface ICloudService {
  isEnabled(): boolean;
  initState(): CloudState;
  startLogin(onSuccess, onError): Promise<string>;
  logout(): Promise<void>;
  syncData(localRuns, config, openid): Promise<SyncResult>;
  getCloudRecords(filter?): Promise<RunRecord[]>;
  saveCloudCache(records): Promise<void>;
  stopPolling(): void;
  checkLoginStatus(config): boolean;
  getPersistedUserInfo(config): CloudUserInfo | null;
}
```

## 自定义实现

要实现自己的云同步后端：

1. 创建实现 `ICloudService` 接口的类
2. 在 `impl/cloud.impl.ts` 中导出为 `CloudServiceImpl`
3. 确保 `impl/` 目录在 `.gitignore` 中

## 安全注意事项

- `src/cloud/impl/` 目录已添加到 `.gitignore`
- 不要将 Cloudbase 环境 ID 提交到公开仓库
- 用户登录信息存储在本地配置文件中
