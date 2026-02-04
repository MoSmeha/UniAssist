import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { SystemMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { z } from "zod";

import KnowledgeBase from "../models/KnowledgeBase.model.js";
import * as todoService from "./todo.service.js";
import * as appointmentService from "./appointment.service.js";
import * as cafeteriaMenuService from "./cafeteriaMenu.service.js";

// Singletons
let embeddingsModel = null;
let knowledgeEmbeddings = []; // { content, embedding, metadata }

/**
 * Cosine similarity between two vectors
 */
const cosineSimilarity = (a, b) => {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

/**
 * Initialize embeddings from MongoDB KnowledgeBase
 */
const initEmbeddings = async () => {
  if (knowledgeEmbeddings.length > 0) return;

  embeddingsModel = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });

  const knowledgeDocs = await KnowledgeBase.find({});

  if (knowledgeDocs.length === 0) {
    console.warn("No knowledge documents found. Run the seeder first.");
    return;
  }

  // Embed all documents
  const contents = knowledgeDocs.map((doc) => doc.content);
  const embeddings = await embeddingsModel.embedDocuments(contents);

  knowledgeEmbeddings = knowledgeDocs.map((doc, i) => ({
    content: doc.content,
    embedding: embeddings[i],
    metadata: { category: doc.category, ...doc.metadata },
  }));

  console.log(`Vector Store initialized with ${knowledgeEmbeddings.length} documents`);
};

/**
 * Similarity search in embedded knowledge
 */
const similaritySearch = async (query, k = 3) => {
  if (!embeddingsModel || knowledgeEmbeddings.length === 0) {
    await initEmbeddings();
  }

  const queryEmbedding = await embeddingsModel.embedQuery(query);

  // Calculate similarities
  const scored = knowledgeEmbeddings.map((doc) => ({
    content: doc.content,
    score: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Sort by score descending and take top k
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((s) => s.content);
};

/**
 * Create LangChain tools that wrap existing services
 * @param {string} userId - The user ID to use for authenticated operations
 */
const createTools = (userId) => {
  const searchCampusInfo = new DynamicStructuredTool({
    name: "search_campus_info",
    description:
      "Search the campus knowledge base for information about locations, rooms, floors, staff, and facilities at Antonine University Zahle.",
    schema: z.object({
      query: z.string().describe("The search query about campus information"),
    }),
    func: async ({ query }) => {
      const results = await similaritySearch(query, 3);
      if (results.length === 0) {
        return "No relevant information found in the knowledge base.";
      }
      return results.join("\n\n");
    },
  });

  const createTodo = new DynamicStructuredTool({
    name: "create_todo",
    description:
      "Create a new todo/task/reminder for the user. Use this when the user wants to be reminded of something or add a task. The user ID is already known - do NOT ask for it.",
    schema: z.object({
      title: z.string().describe("Title of the todo"),
      description: z.string().optional().describe("Optional description"),
      date: z.string().describe("Due date in ISO format (YYYY-MM-DD)"),
      priority: z
        .enum(["Top", "Moderate", "Low"])
        .describe("Priority level of the todo"),
    }),
    func: async ({ title, description, date, priority }) => {
      try {
        const todo = await todoService.createTodo(
          { title, description: description || "", date, priority },
          userId
        );
        return `Successfully created todo: "${todo.title}" for ${date} with ${priority} priority.`;
      } catch (error) {
        return `Failed to create todo: ${error.message}`;
      }
    },
  });

  const createAppointment = new DynamicStructuredTool({
    name: "create_appointment",
    description:
      "Book an appointment with a teacher/professor. Use when user wants to schedule a meeting. The user ID is already known - do NOT ask for it.",
    schema: z.object({
      teacherId: z.string().describe("The ID of the teacher to book with"),
      startTime: z.string().describe("Start time in ISO format"),
      intervalMinutes: z.number().default(30).describe("Duration in minutes"),
      appointmentReason: z.string().describe("Reason for the appointment"),
    }),
    func: async ({ teacherId, startTime, intervalMinutes, appointmentReason }) => {
      try {
        const appt = await appointmentService.createAppointment({
          student: userId,
          teacher: teacherId,
          startTime,
          intervalMinutes,
          appointmentReason,
        });
        return `Successfully booked appointment for ${new Date(startTime).toLocaleString()}. Reason: ${appointmentReason}`;
      } catch (error) {
        return `Failed to book appointment: ${error.message}`;
      }
    },
  });

  const getCafeteriaMenu = new DynamicStructuredTool({
    name: "get_cafeteria_menu",
    description:
      "Get the cafeteria menu for a specific day. Days are: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
    schema: z.object({
      day: z.string().describe("Day of the week (e.g., 'Monday')"),
    }),
    func: async ({ day }) => {
      try {
        const menu = await cafeteriaMenuService.getMenuByDay(day);
        const formatItems = (items) =>
          items.map((i) => `${i.name} (${i.calories} cal)`).join(", ");
        return `Cafeteria menu for ${day}:\n- Breakfast: ${formatItems(menu.breakfast)}\n- Lunch: ${formatItems(menu.lunch)}\n- Dessert: ${formatItems(menu.dessert)}`;
      } catch (error) {
        return `Could not fetch menu: ${error.message}`;
      }
    },
  });

  return [searchCampusInfo, createTodo, createAppointment, getCafeteriaMenu];
};

/**
 * Build the LangGraph workflow for a specific user
 * @param {string} userId - The user ID
 */
const buildGraph = (userId) => {
  const tools = createTools(userId);
  const toolNode = new ToolNode(tools);

  const model = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
    temperature: 0.3,
  }).bindTools(tools);

  const systemPrompt = `You are UniAssist, a helpful AI assistant for Antonine University Zahle campus. You can:
1. Answer questions about campus locations, rooms, floors, and staff using the search_campus_info tool.
2. Create todos and reminders for students using the create_todo tool.
3. Help book appointments with teachers using the create_appointment tool.
4. Provide cafeteria menu information using the get_cafeteria_menu tool.

IMPORTANT: The user is already authenticated. You have their user ID. NEVER ask users for their user ID.
Be helpful, concise, and friendly. When you don't have specific information, use the appropriate tool to find it.
Today's date is ${new Date().toISOString().split("T")[0]}.`;

  // Define state using Annotation
  const AgentState = Annotation.Root({
    messages: Annotation({
      reducer: (prev, next) => [...prev, ...next],
      default: () => [],
    }),
  });

  // Agent node - calls the LLM
  const agentNode = async (state) => {
    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      ...state.messages,
    ]);
    return { messages: [response] };
  };

  // Decide whether to continue to tools or end
  const shouldContinue = (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return END;
  };

  // Build the graph
  const workflow = new StateGraph(AgentState)
    .addNode("agent", agentNode)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue, {
      tools: "tools",
      [END]: END,
    })
    .addEdge("tools", "agent");

  return workflow.compile();
};

/**
 * Main entry point - process a user message
 */
export const chat = async (message, userId) => {
  // Initialize embeddings on first call
  await initEmbeddings();

  // Build graph for this specific user (userId is captured in closure)
  const agentGraph = buildGraph(userId);

  // Run the graph
  const result = await agentGraph.invoke({
    messages: [new HumanMessage(message)],
  });

  // Extract final response
  const lastMessage = result.messages[result.messages.length - 1];
  return lastMessage.content;
};

/**
 * Initialize the agent (call on server startup)
 */
export const initAgent = async () => {
  try {
    await initEmbeddings();
    console.log("UniAssist Agent initialized successfully");
  } catch (error) {
    console.error("Failed to initialize agent:", error.message);
  }
};
