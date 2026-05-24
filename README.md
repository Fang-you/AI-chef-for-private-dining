# AI 私人厨师 (AI Chef for Private Dining)

一个基于 AI 的智能食谱推荐系统，通过识别食材照片，智能推荐营养美味的菜谱。

## 项目简介

这是一个多模态 AI 应用，用户可以：
- 📸 上传食材照片，AI 自动识别食材
- 🔍 智能搜索适合的菜谱
- ⭐ 从营养价值和制作难度两个维度评分排序
- 📋 获取详细的菜谱推荐和制作步骤

## 技术栈

### 后端
- **FastAPI** - 高性能 Web 框架
- **LangChain** - AI Agent 框架
- **通义千问 3.6-plus** - 多模态大语言模型（支持图片识别）
- **Tavily Search** - 网络搜索工具
- **阿里云 OSS** - 图片存储服务

### 前端
- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI 组件库
- **TypeScript** - 类型安全的 JavaScript

## 项目结构

```
AI-chef-for-private-dining/
├── app/                    # 后端应用
│   ├── agent/             # AI Agent 逻辑
│   ├── api/               # API 路由
│   │   └── v1/
│   │       ├── chat.py    # 聊天接口（SSE 流式）
│   │       └── oss.py     # OSS 上传接口
│   ├── common/            # 公共模块
│   ├── models/            # 数据模型
│   ├── static/            # 前端构建产物
│   └── main.py            # 应用入口
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── api/          # API 调用
│   │   ├── components/   # Vue 组件
│   │   ├── composables/  # 组合式函数
│   │   ├── types/        # TypeScript 类型
│   │   ├── App.vue       # 根组件
│   │   └── main.ts       # 入口文件
│   ├── vite.config.ts    # Vite 配置
│   └── package.json
├── .env.example           # 环境变量模板
├── .gitignore
├── pyproject.toml         # Python 依赖
└── README.md
```

## 快速开始

### 1. 克隆项目

```bash
git clone git@github.com:Fang-you/AI-chef-for-private-dining.git
cd AI-chef-for-private-dining
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填入你的 API 密钥：

```bash
cp .env.example .env
```

需要配置的 API：
- **通义千问 API**：https://dashscope.aliyun.com/
- **Tavily Search API**：https://tavily.com/
- **阿里云 OSS**：https://oss.console.aliyun.com/

### 3. 安装后端依赖

```bash
# 使用 uv（推荐）
uv sync

# 或使用 pip
pip install -r requirements.txt
```

### 4. 安装前端依赖

```bash
cd frontend
npm install
```

### 5. 启动开发服务器

**启动后端**（终端 1）：
```bash
python -m app.main
# 后端运行在 http://127.0.0.1:8001
```

**启动前端**（终端 2）：
```bash
cd frontend
npm run dev
# 前端运行在 http://localhost:5173
```

### 6. 访问应用

打开浏览器访问：http://localhost:5173

## 生产部署

### 构建前端

```bash
cd frontend
npm run build
```

构建产物会自动输出到 `app/static/` 目录。

### 启动生产服务器

```bash
python -m app.main
```

访问：http://127.0.0.1:8001

## 功能特性

### 核心功能
- ✅ **多模态输入**：支持文本 + 图片
- ✅ **SSE 流式输出**：实时显示 AI 回复
- ✅ **智能食谱推荐**：基于食材智能搜索菜谱
- ✅ **多维度评分**：营养价值 + 制作难度
- ✅ **会话管理**：支持多轮对话和历史记录
- ✅ **图片上传**：集成阿里云 OSS

### AI Agent 工作流程

1. **食材识别**：使用多模态模型识别照片中的食材
2. **评估新鲜度**：分析食材状态和可用量
3. **智能搜索**：调用 Tavily Search 搜索相关菜谱
4. **评分排序**：从营养和难度两个维度打分
5. **结构化输出**：返回包含食谱信息、得分、推荐理由和参考图片的完整报告

## API 文档

### POST /api/v1/chat/stream
流式对话接口（SSE）

**请求体**：
```json
{
  "message": "这些食材可以做什么菜？",
  "image_url": "https://example.com/image.jpg",
  "thread_id": "thread_xxx"
}
```

**响应**：`text/plain` 流式输出

### GET /api/v1/chat/messages
获取历史消息

**参数**：`thread_id`

### DELETE /api/v1/chat/messages
清空历史消息

**参数**：`thread_id`

### GET /api/v1/oss/presign
获取 OSS 预签名上传 URL

**参数**：`filename`

**响应**：
```json
{
  "uploadUrl": "https://...",
  "contentType": "image/jpeg",
  "accessUrl": "https://..."
}
```

## 开发说明

### 前端开发

- 使用 Vue 3 Composition API
- TypeScript 类型安全
- Element Plus 组件库
- Vite 热更新

### 后端开发

- FastAPI 异步框架
- LangChain Agent 架构
- SSE 流式响应
- 环境变量配置

## 许可证

MIT License

## 作者

[@Fang-you](https://github.com/Fang-you)

## 致谢

- [通义千问](https://tongyi.aliyun.com/) - 多模态大语言模型
- [LangChain](https://www.langchain.com/) - AI Agent 框架
- [Tavily](https://tavily.com/) - 网络搜索 API
- [Element Plus](https://element-plus.org/) - Vue 3 UI 组件库
