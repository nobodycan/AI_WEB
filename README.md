# Smart Personal Hub

一个现代化个人网站 Demo，基于 **React + Vite + Express** 构建，前后端同仓部署。

## 项目结构

```
.
├── frontend/               # 前端 (React + Vite)
│   ├── index.html          # Vite 入口 HTML
│   └── src/
│       ├── main.jsx        # React 页面与交互逻辑
│       └── styles.css      # 页面样式
├── backend/                # 后端 (Node.js + Express)
│   └── index.js            # Express API + 静态资源托管
├── dist/                   # Vite 构建产物（自动生成，勿提交）
├── vite.config.js          # Vite 配置（root 指向 frontend/）
├── package.json            # 统一脚本与依赖
└── .gitignore
```

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React, Vite, CSS |
| 后端 | Node.js, Express |
| 数据源 | Open-Meteo, Weibo Hot Search |
| 工程化 | npm scripts, Vite build |

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

同时启动前端 Vite Dev Server（含 API 代理）：

```bash
npm run dev
```

如需单独调试后端：

```bash
npm run dev:backend
```

> 开发时前端运行在 `:5173`，API 请求通过 Vite proxy 转发到后端 `:3000`。

### 生产构建 & 启动

```bash
npm run build   # 构建前端到 dist/
npm start       # Express 托管 dist/ + API，监听 :3000
```

也可通过环境变量修改端口：

```bash
PORT=8080 npm start
```

## API 说明

### 健康检查

```http
GET /api/health
```

### 查询天气

```http
GET /api/weather?city=上海
```

### 微博热搜

```http
GET /api/weibo-hot
```

## 部署说明

本项目使用 **同仓单服务** 部署模式，适合低成本云服务器或 PaaS 平台：

1. 上传代码到服务器
2. 执行 `npm install && npm run build`
3. 执行 `npm start` 启动服务

平台需支持 **Node.js**，Express 同时负责 API 与静态页面托管。

## License

仅作为个人网站 Demo 与学习示例使用。
