import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

// File DB for users
const usersFilePath = path.join(process.cwd(), "src", "data", "users.json");

async function createUser(params) {
  const usersData = await fs.readFile(usersFilePath, "utf-8");
  const users = JSON.parse(usersData);

  const newId = Math.max(...users.map((u) => u.id), 0) + 1;

  const newUser = {
    id: newId,
    name: params.name,
    email: params.email,
    address: params.address,
    phone: params.phone,
  };

  users.push(newUser);

  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

  return newUser;
}

const mcpServer = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

mcpServer.tool(
  "create-user",
  "Create a new user in the database",
  {
    name: z.string(),
    email: z.string(),
    address: z.string(),
    phone: z.string(),
  },
  {
    title: "Create User",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  },
  async (params) => {
    try {
      const result = await createUser(params);
      return {
        content: [
          {
            type: "text",
            text: `User created successfully with ID: ${result.id}`,
          },
        ],
      };
    } catch {
      return {
        content: [{ type: "text", text: "Failed to save user" }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);

  console.log("🚀 MCP Server started");
}

main();
