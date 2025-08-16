import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const mcpServer = new McpServer({
  name: "my-mcp-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);

  console.log("MCP Server started");
}

main();
