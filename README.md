# Getting Started with MCP Servers

A complete **Model Context Protocol (MCP)** implementation with server and client components for AI-powered user management.

## What's Inside

- **MCP Server** - User management with AI-generated data
- **MCP Client** - Interactive CLI with Google Gemini integration
- **Resources** - Get all users or individual user details
- **Tools** - Create users manually or with AI assistance
- **Prompts** - Generate fake user data

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start MCP Server

```bash
npm start
# Server runs on stdio transport
```

### 3. Use with Cursor

The server is configured to work with Cursor's MCP interface. Restart Cursor to see available tools and resources.

## Features

### 🛠️ **Tools**

- `create-user` - Manual user creation
- `create-random-user` - AI-powered user generation

### 📊 **Resources**

- `users://all` - Get all users
- `users://{userId}/profile` - Get specific user

### 💬 **Prompts**

- `generate-fake-user` - AI assistance for user data

## Project Structure

```
├── src/
│   ├── index.js          # MCP Server
│   ├── client.js         # MCP Client
│   └── data/
│       └── users.json    # User database
└── package.json
```

## Development

```bash
# Server with auto-reload
npm run dev

# Run client (requires setup)
npm run client

# Debug with MCP Inspector
npm run inspect
```

## Requirements

- Node.js 18+
- For client: Google Gemini API key in `.env`

## License

MIT
