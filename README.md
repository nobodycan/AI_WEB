# Smart Personal Hub

一个现代化个人网站 Demo，基于 **React + Vite + Express** 构建。网站不仅包含个人介绍、技能、项目和联系方式，还集成了天气查询与微博热搜等实时功能，适合作为个人主页、作品集或数字名片的起点。

## 功能亮点

- 现代化个人主页：Hero、关于我、能力展示、精选项目、联系方式
- 城市天气查询：输入城市名称，查看当前温度、天气状态、风速、最高 / 最低温
- 今日微博热搜：展示实时热门微博话题，接口异常时自动使用备用数据
- 前后端分层：React 前端 + Express API 服务
- 美观响应式 UI：暗色渐变、玻璃拟态卡片、移动端适配、加载骨架屏
- 生产构建支持：使用 Vite 构建静态资源，由 Express 托管页面和 API

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | React, Vite, CSS |
| 后端 | Node.js, Express |
| 数据源 | Open-Meteo, Weibo Hot Search |
| 工程化 | npm scripts, Vite build |

## 项目结构

```text
.
├── index.html              # Vite 入口 HTML
├── package.json            # 项目脚本与依赖
├── package-lock.json       # 依赖锁定文件
├── server/
│   └── index.js            # Express API 与静态资源服务
└── src/
    ├── main.jsx            # React 页面与交互逻辑
    └── styles.css          # 页面样式
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 本地开发

```bash
npm run dev
```

默认会启动 Vite 开发服务。

### 3. 生产构建

```bash
npm run build
```

构建产物会输出到 `dist/` 目录。

### 4. 启动生产服务

```bash
npm start
```

服务默认运行在：

```text
http://localhost:3000
```

也可以通过环境变量指定端口：

```bash
PORT=8080 npm start
```

## API 说明

### 健康检查

```http
GET /api/health
```

示例响应：

```json
{
  "status": "ok",
  "service": "personal-site-smart-demo"
}
```

### 查询天气

```http
GET /api/weather?city=上海
```

示例响应：

```json
{
  "city": "上海 · 上海市 · 中国",
  "temperature": 11.1,
  "windSpeed": 9.8,
  "code": 61,
  "icon": "🌧️",
  "description": "小雨",
  "max": 12.4,
  "min": 10.6,
  "time": "2026-04-29 20:15"
}
```

### 查询微博热搜

```http
GET /api/weibo-hot
```

示例响应：

```json
{
  "source": "weibo",
  "items": [
    {
      "title": "热门话题标题",
      "hot": "113万",
      "url": "https://s.weibo.com/weibo?q=..."
    }
  ]
}
```

当微博接口不可用时，服务会返回内置备用数据，避免页面功能区空白。

## 页面定制建议

你可以在 `src/main.jsx` 中修改：

- 姓名与职业介绍
- 关于我文案
- 技能列表
- 项目案例
- 邮箱与 GitHub 链接
- 默认查询城市

你可以在 `src/styles.css` 中调整：

- 主题色
- 卡片样式
- 背景渐变
- 响应式布局断点

## 构建与部署

生产部署流程通常为：

```bash
npm install
npm run build
npm start
```

部署平台需要支持 Node.js 服务，因为项目使用 Express 提供 API 与静态页面托管。

## 注意事项

- 天气数据来自 Open-Meteo，无需 API Key。
- 微博热搜接口依赖第三方页面接口，可能受网络或访问策略影响；项目已内置 fallback 数据。
- 如果只需要静态个人主页，可以移除 `server/` 中的 API 逻辑并单独部署 Vite 构建产物。

## License

仅作为个人网站 Demo 与学习示例使用。
