// --- Imports ---
import "dotenv/config"; // Loads environment variables, e.g., GEMINI_API_KEY [38]
import { Client } from "@modelcontextprotocol/sdk/client/index.js"; // Core MCP client library [28]
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"; // Transport for local communication [28]
import { select, input, confirm } from "@inquirer/prompts"; // CLI prompting library [29, 30]
import { generateText } from "ai"; // AI SDK for interacting with LLMs and tools [37, 39]
import { createGoogleGenerativeAI } from "@ai-sdk/google"; // Google-specific AI SDK for Gemini [37, 38]

// --- Global MCP Client and AI Model Setup ---

// Initialize the MCP Client with a name, version, and declared capabilities (sampling) [28]
const mcp = new Client({
  name: "test client video",
  version: "1.0.0",
  capabilities: {
    sampling: {}, // Client declares ability to handle sampling requests from the server [28]
  },
});

// Configure the Standard IO transport for local server communication [28]
const transport = new StdioClientTransport({
  command: "node", // Command to start the server
  args: ["src/index.js"], // Arguments for the server command (path to compiled server) [28]
  standardError: "ignore", // Ignores warnings from experimental Node.js features used in the server [29]
});

// Initialize the Google Generative AI model (Gemini) with API key from environment variables [38]
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// --- Helper Functions for Handling MCP Interactions ---

/**
 * Handles calling a specific tool on the MCP server.
 * Prompts the user for tool selection and required parameters. [31, 32]
 */
async function handleTool(tools) {
  const toolName = await select({
    message: "Select a tool:",
    choices: tools.map((tool) => ({
      name: tool.annotations?.title || tool.name, // Use human-readable title if available [31]
      value: tool.name,
      description: tool.description,
    })),
  });

  const selectedTool = tools.find((t) => t.name === toolName);

  if (!selectedTool) {
    console.error("Tool not found.");
    return;
  }

  const args = {};
  // Loop through the tool's input schema to prompt for arguments [32]
  if (selectedTool.inputSchema && selectedTool.inputSchema.properties) {
    for (const [key, value] of Object.entries(
      selectedTool.inputSchema.properties
    )) {
      args[key] = await input({
        message: `Enter value for ${key} (Type: ${value.type || "string"}):`, // Display expected type [32]
      });
    }
  }

  const result = await mcp.callTool(selectedTool.name, args); // Call the tool on the server [32]

  // Log the result from the tool call [32]
  if (result.contents && result.contents.length > 0) {
    console.log(
      `\n--- Tool Result ---\n${result.contents.text}\n------------------`
    );
  } else {
    console.log("Tool call returned no content.");
  }
}

/**
 * Handles reading a specific resource from the MCP server.
 * Prompts the user for resource selection and dynamic URI parameters. [33-35]
 */
async function handleResource(resources, resourceTemplates) {
  const resourceUri = await select({
    message: "Select a resource:",
    choices: [
      ...resources.map((res) => ({
        name: res.name,
        value: res.uri.href,
        description: res.description,
      })),
      ...resourceTemplates.map((template) => ({
        name: template.name,
        value: template.uri.href,
        description: template.description,
      })),
    ],
  });

  let finalUri = resourceUri;
  // Extract and prompt for dynamic parameters in the URI (e.g., {userId}) [34]
  const paramMatches = [...resourceUri.matchAll(/{([^}]+)}/g)]; // Use spread to convert iterator to array

  if (paramMatches && paramMatches.length > 0) {
    for (const match of paramMatches) {
      const paramName = match[1]; // The name inside the brackets [34]
      const paramValue = await input({
        message: `Enter value for ${paramName}:`,
      });
      finalUri = finalUri.replace(`{${paramName}}`, paramValue); // Replace placeholder with user input [34]
    }
  }

  const result = await mcp.readResource(finalUri); // Read the resource from the server [35]

  // Log the resource content, pretty-printing if it's JSON [35]
  if (result.contents && result.contents.length > 0) {
    const rawText = result.contents.text;
    try {
      const parsedJson = JSON.parse(rawText);
      console.log(
        `\n--- Resource Content ---\n${JSON.stringify(
          parsedJson,
          null,
          2
        )}\n------------------------`
      );
    } catch (e) {
      console.log(
        `\n--- Resource Content ---\n${rawText}\n------------------------`
      );
    }
  } else {
    console.log("Resource returned no content.");
  }
}

/**
 * Handles triggering a specific prompt on the MCP server.
 * Prompts the user for prompt selection and required arguments. [36-38]
 */
async function handlePrompt(prompts) {
  const promptName = await select({
    message: "Select a prompt:",
    choices: prompts.map((prompt) => ({
      name: prompt.name,
      value: prompt.name,
      description: prompt.description,
    })),
  });

  const selectedPrompt = prompts.find((p) => p.name === promptName);

  if (!selectedPrompt) {
    console.error("Prompt not found.");
    return;
  }

  const args = {};
  // Prompt for arguments if the prompt has any [36]
  if (selectedPrompt.arguments && selectedPrompt.arguments.length > 0) {
    for (const arg of selectedPrompt.arguments) {
      args[arg.name] = await input({
        message: `Enter value for ${arg.name}:`,
      });
    }
  }

  const response = await mcp.getPrompt(selectedPrompt.name, args); // Get the prompt content from the server [36]

  // Process each message received from the prompt (can be multiple) [36]
  for (const message of response.messages) {
    await handleServerMessagePrompt(message);
  }
}

/**
 * Helper function to process messages received from the server (either from getPrompt or sampling). [37]
 * Can optionally prompt the user to run the AI prompt.
 * @returns The AI generated text if successful and allowed, otherwise undefined.
 */
async function handleServerMessagePrompt(message, askConfirmation = true) {
  if (message.content.type !== "text") {
    // Only handles text content types as per video [37]
    console.log(`Ignoring non-text message of type: ${message.content.type}`);
    return;
  }

  console.log(
    `\n--- Prompt Content ---\n${message.content.text}\n----------------------`
  );

  let shouldRun = true;
  if (askConfirmation) {
    shouldRun = await confirm({
      message: "Would you like to run the above prompt?",
      default: true,
    });
  }

  if (!shouldRun) {
    return;
  }

  try {
    const model = google.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the configured Gemini model [38]
    const { text } = await generateText({
      model: model,
      prompt: message.content.text, // Use the prompt content from the server [38]
    });
    console.log(`\n--- AI Response ---\n${text}\n-------------------`);
    return text; // Return the generated text for sampling requests [42]
  } catch (error) {
    console.error("Failed to generate AI text:", error);
    return undefined;
  }
}

/**
 * Handles a general AI query, potentially using available tools. [39-41]
 * Allows the AI model to decide when and how to use the server's tools.
 */
async function handleQuery(tools) {
  const queryText = await input({
    message: "What is your query?",
  });

  const model = google.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use the configured Gemini model [39]

  // Use generateText with tools passed to allow the AI to use them [39]
  const { text, toolResults } = await generateText({
    model: model,
    prompt: queryText,
    tools: tools.reduce((acc, currentTool) => {
      acc[currentTool.name] = tool({
        description: currentTool.description,
        // Convert the tool's input schema to the format expected by the AI SDK [39]
        parameters: JSONSchema.from(currentTool.inputSchema),
        // Define the execute function that calls the MCP tool on the server [40]
        execute: async (args) => {
          const result = await mcp.callTool(currentTool.name, args);
          // Return the text content from the tool's response [40]
          return result.contents && result.contents.length > 0
            ? result.contents.text
            : "";
        },
      });
      return acc;
    }, {}), // Initialize accumulator as an empty object for tool set [40]
  });

  // Log the AI's response, prioritizing direct text or tool results [40, 41]
  if (text) {
    console.log(
      `\n--- AI Response (Text) ---\n${text}\n--------------------------`
    );
  } else if (toolResults && toolResults.length > 0) {
    console.log(
      `\n--- AI Response (Tool Result) ---\n${toolResults.result}\n---------------------------------`
    );
  } else {
    console.log("No text generated or tool results found.");
  }
}

// --- Main Application Function ---
/**
 * Main entry point of the client application.
 * Connects to the server, fetches capabilities, and runs the main interaction loop. [29, 30]
 */
async function main() {
  await mcp.connect(transport); // Establish connection to the MCP server [29]
  console.log("You are connected to the MCP server!");

  // Fetch all available capabilities from the connected server [29]
  const [tools, prompts, resources, resourceTemplates] = await Promise.all([
    mcp.listTools(),
    mcp.listPrompts(),
    mcp.listResources(),
    mcp.listResourceTemplates(),
  ]);

  // Main interactive loop for the CLI [30]
  while (true) {
    const option = await select({
      message: "What would you like to do?",
      choices: [
        { name: "Query AI", value: "query" },
        { name: "Call Tool", value: "tool" },
        { name: "Call Resource", value: "resource" },
        { name: "Call Prompt", value: "prompt" },
      ],
    });

    switch (option) {
      case "tool":
        await handleTool(tools); // Call the tool handler
        break;
      case "resource":
        await handleResource(resources, resourceTemplates); // Call the resource handler
        break;
      case "prompt":
        await handlePrompt(prompts); // Call the prompt handler
        break;
      case "query":
        await handleQuery(tools); // Call the general AI query handler
        break;
      default:
        console.log("Invalid option.");
    }
    console.log("\n"); // Add a newline for better readability between interactions
  }
}

// Execute the main function when the script runs
main().catch(console.error);
