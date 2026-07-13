## 🌟 项目赞助商 (Sponsor)

<p align="center">
  <a href="https://derouter.ai?ref=0oZZ1HVc" target="_blank">
    <b>DeRouter</b> — 基于区块链的纯正透明大模型 API 网关
  </a>
</p>

**DeRouter** 通过区块链技术保证 Claude、GPT 官方 API 的**纯正与透明**，杜绝掺水降智问题。目前 Claude、GPT 在能力上仍领先国内大模型。

- 🔗 官网：https://derouter.ai?ref=0oZZ1HVc
- 🐦 Twitter：https://x.com/derouter_net
- 💰 **有多余的 Claude 账号**：可托管到平台赚取收益
- ⚡ **有 API 需求**：可使用其平台，价格为官方 API 的 **1-2 折**

<br>

<p align="center">
  <a href="https://bytevirt.com/aff.php?aff=209" target="_blank">
    <b>ByteVirt</b> — 始于方寸字节，成就无限云端
  </a>
</p>

**ByteVirt** 是一家专注于高性价比云服务器的 VPS 厂商，提供稳定可靠的虚拟化云端主机，适合部署 KUI 节点、探针 bash 及各类自建服务。

- 🔗 官网：https://bytevirt.com/aff.php?aff=209
- 🖥️ **多地域机房**：可按需选择节点位置，满足代理与监控部署需求
- ⚡ **稳定高速**：优质网络与虚拟化性能，保障服务长期在线

---

# KUI x Server Monitor Pro

KUI 是一套基于 Cloudflare 的代理管理、服务器探针和住宅双隧道面板。

- Pages：网页、API、登录和配置。
- D1：保存用户、VPS、节点和流量。
- Realtime Worker + Durable Objects：提供 1-5 秒实时状态和配置推送。
- VPS Agent：监控服务器、管理 sing-box 和住宅代理。

## 功能

- XTLS-Reality、Hysteria2、TUIC、Trojan、H2/gRPC-Reality、AnyTLS、Naive、VLESS-Argo。
- CPU、内存、磁盘、负载、网速、TCP/UDP 和线路延迟探针。
- 多用户、流量、配额、到期和订阅管理。
- OpenVPN 主备住宅隧道和 SOCKS5/HTTP 代理。
- Core 和住宅状态通常 1-5 秒更新。
- WebSocket 断开 30 秒后自动切换 HTTP，恢复后自动切回。

# 快速部署

只需要按顺序完成三部分：

```text
一、部署 Pages + D1
二、部署 Realtime Worker
三、在 VPS 执行面板生成的命令
```

## 一、部署 Pages + D1

### 1. Fork 仓库

点击 GitHub 右上角 **Fork**，复制本项目到自己的 GitHub。

### 2. 创建 D1

进入 Cloudflare：

```text
Storage & databases → D1 SQL database → Create
```

数据库名称可填写：

```text
kui-db
```

### 3. 创建 Pages

进入 Cloudflare：

```text
Workers & Pages → Create → Pages → Connect to Git
```

选择刚才 Fork 的仓库，配置：

| 项目 | 填写内容 |
|---|---|
| Production branch | `dev`，或你实际使用的分支 |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `.` |

点击部署。

### 4. 绑定 D1

进入 Pages 项目设置，在 **Production 环境**添加 D1 binding。不要只绑定 Preview：

| Binding name | Database |
|---|---|
| `DB` | 选择刚创建的 `kui-db` |

必须叫 `DB`。

### 5. 添加 Pages 变量

在 Pages 的 **Production** 环境添加：

| 名称 | 类型 | 填写内容 |
|---|---|---|
| `ADMIN_USERNAME` | Variable | 后台用户名 |
| `ADMIN_PASSWORD` | Secret | 后台强密码 |
| `PROXY_USER` | Secret | 住宅代理用户名 |
| `PROXY_PASS` | Secret | 住宅代理强密码 |

暂时不要添加 `REALTIME_URL`。

保存后重新部署 Pages。

### 6. 登录一次

打开 Pages 分配的域名，例如：

```text
https://你的项目.pages.dev
```

使用 `ADMIN_USERNAME` 和 `ADMIN_PASSWORD` 登录。首次登录会自动初始化 D1，无需手工导入 SQL。

能正常登录就说明 Pages + D1 已完成。

## 二、部署 Realtime Worker

### 1. 点击一键部署

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/a6216abcd/K-UI/tree/dev/realtime)

按钮会创建：

- `kui-realtime` Worker。
- `VpsPresence` Durable Object。
- `DashboardHub` Durable Object。
- Worker 所需绑定。

### 2. 填写 Worker 变量

部署页面或 Worker 设置中填写：

| 名称 | 填写内容 |
|---|---|
| `ADMIN_USERNAME` | 必须与 Pages 一样 |
| `ADMIN_PASSWORD` | 必须与 Pages 一样，使用 Secret |
| `PAGES_ORIGIN` | Pages 地址，例如 `https://你的项目.pages.dev` |

`PAGES_ORIGIN` 末尾不要添加 `/`。

### 3. 让 Worker 使用 Pages 的 D1

这是最重要的一步。

进入：

```text
kui-realtime → Settings → Bindings
```

找到 `DB`，确认它选择的是 Pages 使用的同一个 `kui-db`。

```text
Pages DB ID = Worker DB ID
```

如果一键部署自动创建了另一个空 D1，删除 Worker 的 `DB` binding，再重新绑定 Pages 当前使用的 `kui-db`。

不要删除：

```text
VPS_PRESENCE  → VpsPresence
DASHBOARD_HUB → DashboardHub
```

### 4. 检查 Worker

访问：

```text
https://你的Worker地址/health
```

正常返回：

```json
{"ok":true,"service":"kui-realtime","version":1}
```

### 5. 在 Pages 开启实时模式

回到 Pages 的 Production 环境变量，添加：

```text
REALTIME_URL=https://你的Worker地址
```

末尾不要添加 `/`，然后重新部署 Pages。

至此 Cloudflare 部署完成。

## 三、部署 VPS

执行前确认：VPS 是 `x86_64` 或 `aarch64`，可以出站访问 HTTPS，并且住宅代理所需的 `/dev/net/tun` 存在。Full Deploy 使用 root 修改系统服务和网络配置。

住宅代理默认监听所有 IPv4/IPv6 地址，默认端口 `7920/TCP`。执行部署前先在云防火墙和系统防火墙中限制该端口，只允许可信客户端 IP，或者暂时不开放公网入站。

### 1. 在面板添加 VPS

登录 KUI 后台：

```text
服务器与节点 → 接入机器
```

填写：

- VPS 名称。
- VPS 公网 IP。
- Debian/Ubuntu 或 Alpine。

点击接入机器。

### 2. 复制 Full Deploy Command

服务器卡片会生成专属命令。复制面板显示的命令，在对应 VPS 的 root Shell 执行。

不要自己替换成管理员密码。命令中的 Token 只属于该 VPS。

### 3. 等待上线

正常等待约 30-90 秒，面板会出现探针状态。

Debian/Ubuntu 检查：

```bash
systemctl is-active kui-agent sing-box proxy-lite
journalctl -u kui-agent -n 50 --no-pager
journalctl -u proxy-lite -n 50 --no-pager
```

Alpine 检查：

```bash
rc-service kui-agent status
rc-service sing-box status
rc-service proxy-lite status
tail -n 50 /var/log/kui-agent.log
tail -n 50 /var/log/proxy-lite.log
```

如果安装了住宅代理，每台 VPS 正常应有两条 Python 到 Cloudflare `443` 的长连接：Core 和 Proxy 各一条。

# 部署成功的标准

- Pages 可以正常登录。
- Pages 和 Worker 绑定同一个 D1。
- Worker `/health` 返回成功。
- 浏览器后台显示 Dashboard WebSocket 已连接。
- VPS Core 和 Proxy WebSocket 在线。
- CPU、内存和网速通常 1-5 秒更新。
- 修改节点或住宅配置后，VPS 通常数秒内收到。
- WebSocket 健康时，浏览器不再周期轮询 Pages API。

# 常见问题

## Pages 提示缺少 DB

检查 Pages Production 的 D1 binding：

```text
Binding name 必须为 DB
```

修改后重新部署 Pages。

## Worker health 正常，但 WebSocket 失败

检查四项：

1. Worker 和 Pages 是否使用同一个 D1 ID。
2. Worker 和 Pages 的管理员用户名是否相同。
3. Worker 和 Pages 的管理员密码是否相同。
4. `PAGES_ORIGIN` 是否与浏览器打开的 Pages 地址完全相同。

## Agent 返回 401 或 403

- VPS IP 必须先在面板添加。
- 必须使用该 VPS 自己的 Agent Token。
- 重新复制面板最新生成的 Full Deploy Command。

## 探针不更新

Debian/Ubuntu：

```bash
systemctl status kui-agent
journalctl -u kui-agent -n 100 --no-pager
```

Alpine：

```bash
rc-service kui-agent status
tail -n 100 /var/log/kui-agent.log
```

## 住宅代理显示 0/2 或 1/2

检查：

- `/dev/net/tun` 是否存在。
- `proxy-lite` 是否运行。
- OpenVPN 是否能访问外网。
- Pages 是否配置 `PROXY_USER` 和 `PROXY_PASS`。
- 所选国家是否有可用 VPNGate 节点。

住宅隧道依赖公开节点和网络质量，不保证始终为 2/2。

## 一键 Worker 部署失败

使用本地 Wrangler 部署：

```bash
git clone https://github.com/a6216abcd/K-UI.git
cd K-UI/realtime
npm install
```

编辑 `wrangler.jsonc`：

- `ADMIN_USERNAME`。
- `PAGES_ORIGIN`。
- 如果使用已有 D1，填写真实 `database_name` 和 `database_id`。

执行：

```bash
npx wrangler login
npx wrangler deploy
npx wrangler secret put ADMIN_PASSWORD
```

<details>
<summary><b>高级说明：实时周期、fallback 和额度</b></summary>

## 实时周期

| 通道 | 行为 |
|---|---|
| Core 状态 | 每 5 秒 WebSocket 上报 |
| Proxy 状态 | 每 5 秒 WebSocket 上报 |
| Dashboard | 服务端主动推送，通常 1-5 秒 |
| 配置通知和结果 | 实时推送 |
| HTTP 状态持久化 | WebSocket 健康时约 15 分钟 |
| HTTP 配置校验 | WebSocket 健康时约 15 分钟 |

## HTTP fallback

WebSocket 连续断开满 30 秒后：

- Core/Proxy 状态使用低频 HTTP 上报。
- 配置使用 HTTP 检查。
- 浏览器恢复 Pages API 轮询。
- WebSocket 恢复后自动停止高频 HTTP。

## 额度估算

以 2 台 VPS、每台 Core + Proxy、1 个常开后台为例：

- Durable Objects 请求约 3.8-3.9 万/天。
- Presence storage 写入约 6.9 万行/天。
- Pages Functions 健康态约 1,200 请求/天。

额度和定价可能调整，请以 Cloudflare 官方文档和账户 Dashboard 为准。

</details>

<details>
<summary><b>高级说明：更新、安全和历史迁移</b></summary>

## 自动更新

VPS 组件每小时通过 Pages 鉴权端点检查更新，校验 SHA256 和 Python 语法后原子替换。

更新文件包括：

```text
/opt/kui/agent.py
/opt/kui/realtime_client.py
/opt/proxy_lite/lite_manager.py
/opt/proxy_lite/proxy_server.py
/opt/proxy_lite/realtime_client.py
```

## 安全

- `ADMIN_PASSWORD`、`PROXY_USER`、`PROXY_PASS` 使用 Secret。
- 不要公开 Agent Token、Cloudflare API Token 和 VPS root 密码。
- 住宅代理端口只允许可信来源访问。
- 后台自定义 Script 会执行任意 JavaScript，只允许可信管理员使用。

## 历史 Agent

`LEGACY_AGENT_AUTH=true` 只用于旧 Agent 临时迁移，新部署不要启用。最稳妥方式是重新执行面板当前生成的 Full Deploy Command。

</details>

# 项目结构

```text
K-UI/
├── index.html
├── functions/api/[[path]].js
├── realtime/
│   ├── src/index.js
│   ├── wrangler.jsonc
│   └── package.json
└── vps/
    ├── agent.py
    ├── realtime_client.py
    ├── kui.sh
    ├── lite_manager.py
    ├── proxy_server.py
    └── residential-proxy.sh
```

# 支持与贡献

- Issues：https://github.com/a6216abcd/K-UI/issues
- Pull Requests：https://github.com/a6216abcd/K-UI/pulls

提交 Issue 时不要附带密码、Token 或完整 VPS 配置。
