export const DEMO_CHATS = [
  {
    id: "1",
    title: "Welcome to Shuttapy",
    messages: [
      {
        role: "user",
        content: "What can you do?",
      },
      {
        role: "assistant",
        content:
          "I can help you work with your local AI environment, understand files, run tasks, and assist with your projects.",
      },
    ],
  },
  {
    id: "2",
    title: "Local AI assistant",
    messages: [
      {
        role: "user",
        content: "How should I build my local AI agent?",
      },
      {
        role: "assistant",
        content:
          "We can design the agent around local models, tools, permissions, memory, and a safe execution layer.",
      },
    ],
  },
  {
    id: "3",
    title: "MERN project",
    messages: [
      {
        role: "user",
        content: "Check my project structure",
      },
      {
        role: "assistant",
        content:
          "I can inspect your project and help you understand how the different parts connect.",
      },
    ],
  },
];

export const DEMO_TRACE = [
  {
    id: "1",
    label: "Understand the request",
    status: "done",
  },
  {
    id: "2",
    label: "Select required tools",
    status: "done",
  },
  {
    id: "3",
    label: "Waiting for execution",
    status: "todo",
  },
];

export const DEMO_MEMORIES = [
  "Local AI assistant project",
  "MERN development",
  "Shuttapy",
];