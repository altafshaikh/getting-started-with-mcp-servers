# 🚀 Getting Started with MCP Servers

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![MCP Protocol](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue.svg)](https://modelcontextprotocol.io/)

A complete **Model Context Protocol (MCP)** implementation featuring both server and client components for AI-powered user management. This project demonstrates how to build production-ready MCP servers with modern JavaScript and AI integration.

## ✨ What's Inside

| Component             | Description               | Features                                        |
| --------------------- | ------------------------- | ----------------------------------------------- |
| 🖥️ **MCP Server**     | User management system    | Resources, Tools, Prompts, AI Sampling          |
| 🔄 **MCP Client**     | Interactive CLI interface | Google Gemini AI, Real-time interactions        |
| 📊 **Database**       | JSON-based storage        | Auto-incrementing IDs, File persistence         |
| 🤖 **AI Integration** | Smart data generation     | Fake user creation, Natural language processing |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ installed ([Download here](https://nodejs.org/))
- **Cursor IDE** for MCP integration ([Get Cursor](https://cursor.sh/))
- **Google Gemini API Key** for client usage ([Get API Key](https://ai.google.dev/))

### Installation

```bash
# Clone the repository
git clone https://github.com/altafshaikh/getting-started-with-mcp-servers.git
cd getting-started-with-mcp-servers

# Install dependencies
npm install

# Start the MCP server
npm start
```

### 🔧 Setup with Cursor

1. **Restart Cursor** after starting the server
2. **Check MCP Panel** - You should see "my-mcp-server" with tools enabled
3. **Start using tools** directly in Cursor's interface

## 🎯 Features Overview

### 🛠️ **Available Tools**

| Tool                 | Purpose              | Usage                                 |
| -------------------- | -------------------- | ------------------------------------- |
| `create-user`        | Manual user creation | Requires: name, email, address, phone |
| `create-random-user` | AI-generated users   | No parameters - fully automated       |

**Example Usage:**

```javascript
// Manual user creation
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St, City",
  "phone": "555-0123"
}
```

### 📊 **Available Resources**

| Resource       | URI Pattern                | Description                      |
| -------------- | -------------------------- | -------------------------------- |
| `users`        | `users://all`              | Retrieve all users from database |
| `user-details` | `users://{userId}/profile` | Get specific user by ID          |

**Example Queries:**

```
users://all              → All users
users://1/profile        → User with ID 1
users://4/profile        → User with ID 4 (teachmebro)
```

### 💬 **Available Prompts**

| Prompt               | Parameters      | Purpose                                        |
| -------------------- | --------------- | ---------------------------------------------- |
| `generate-fake-user` | `name` (string) | AI assistance for creating realistic user data |

## 🏗️ Project Architecture

```
getting-started-with-mcp-servers/
├── 📁 src/
│   ├── 🖥️ index.js              # MCP Server (main)
│   ├── 👤 client.js             # MCP Client with AI
│   └── 📁 data/
│       └── 👥 users.json        # User database
├── 📄 package.json              # Dependencies & scripts
├── 📄 README.md                 # This file
└── 🚫 .gitignore               # Git ignore patterns
```

### 🔧 **Core Components**

#### MCP Server (`src/index.js`)

- **Framework**: Model Context Protocol SDK
- **Transport**: Standard IO (for Cursor integration)
- **Database**: File-based JSON storage
- **AI Features**: Server-initiated sampling for data generation

#### MCP Client (`src/client.js`)

- **AI Engine**: Google Gemini 1.5 Flash
- **Interface**: Interactive CLI with inquirer prompts
- **Features**: Tool execution, Resource queries, Prompt handling

## 📋 Development Guide

### Available Scripts

| Command           | Purpose           | Description                 |
| ----------------- | ----------------- | --------------------------- |
| `npm start`       | Production server | Start MCP server for Cursor |
| `npm run dev`     | Development mode  | Auto-reload on file changes |
| `npm run client`  | Run client        | Interactive MCP client      |
| `npm run inspect` | Debug server      | MCP Inspector interface     |

### 🔍 **Development Workflow**

```bash
# 1. Start server in dev mode
npm run dev

# 2. In another terminal, test with client
npm run client

# 3. Debug with MCP Inspector
npm run inspect
```

### 🐛 **Debugging Tips**

- **Server not connecting?** Check if port is available
- **Tools not showing?** Restart Cursor after server changes
- **Client errors?** Verify Google API key in `.env` file

## 🌟 **Advanced Usage**

### Creating Custom Tools

```javascript
mcpServer.tool(
  "tool-name",
  "Description of the tool",
  {
    param1: z.string(),
    param2: z.number(),
  },
  async (params) => {
    // Tool implementation
    return {
      content: [{ type: "text", text: "Result" }],
    };
  }
);
```

### Adding Resources

```javascript
mcpServer.resource(
  "resource-name",
  "resource://uri/pattern",
  {
    description: "Resource description",
    mimeType: "application/json",
  },
  async (uri) => {
    // Resource implementation
    return {
      contents: [{ uri: uri.href, text: "data" }],
    };
  }
);
```

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📝 **Code Style**

- Use **ESLint** configuration provided
- Follow **conventional commits** format
- Add **JSDoc** comments for functions
- Include **tests** for new features

## 📚 **Resources & Links**

- 📖 [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- 🔧 [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- 🤖 [Google AI SDK](https://ai.google.dev/)
- 💻 [Cursor IDE](https://cursor.sh/)

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## ⭐ **Show Your Support**

If this project helped you, please consider giving it a ⭐ star on GitHub!

---

<p align="center">
  <strong>Built with ❤️ using Model Context Protocol</strong>
</p>
