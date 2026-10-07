import {
  BookOpen,
  Bot,
  Code,
  Film,
  Folder,
  Globe,
  ImageIcon,
  MessageSquare,
  Mic,
} from "lucide-react";

export const MODES = {
  chat: {
    label: "Chat",
    icon: MessageSquare,
    hint: "Talk, plan and remember things. Everything stays on this PC.",
    actions: ["Remember …", "Plan my week", "What do you remember about me?"],
  },
  files: {
    label: "Files",
    icon: Folder,
    hint: "Read, search, create, edit and delete files. Deleting always asks you first.",
    actions: [
      "Browse my Documents folder",
      "Search files for …",
      "Create a file …",
      "Delete the file …",
      "Take a screenshot",
      "Read my clipboard",
    ],
  },
  code: {
    label: "Code",
    icon: Code,
    hint: "Understand a project, fix bugs, run tests and check the fix.",
    actions: [
      "Find bugs in this project",
      "Explain this error: …",
      "Run the tests",
      "Show git status",
      "Show git diff",
      "Fix it and verify",
    ],
  },
  browser: {
    label: "Browser",
    icon: Globe,
    hint: "Open sites, search, read pages, fill forms and download files.",
    actions: [
      "Search the web for …",
      "Open …",
      "Read this page: …",
      "Fill the form on …",
      "Download …",
    ],
  },
  voice: {
    label: "Voice",
    icon: Mic,
    hint: "Press the mic and speak. In this tab your words are sent straight away.",
    actions: ["Dictate a note", "Read my last answer aloud"],
  },
  images: {
    label: "Images",
    icon: ImageIcon,
    hint: "Generate images, describe them, and reuse saved character sheets.",
    actions: [
      "Generate an image of …",
      "Describe this image",
      "Make a character reference sheet",
      "Use my saved character …",
    ],
  },
  video: {
    label: "Video",
    icon: Film,
    hint: "Script to keyframes to clips to a final MP4, with consistent characters.",
    actions: [
      "Turn this script into a video …",
      "Make keyframes for scene 1",
      "Add dialogue and music",
      "Combine clips into an MP4",
    ],
  },
  knowledge: {
    label: "Knowledge",
    icon: BookOpen,
    hint: "Search your own documents and project notes.",
    actions: [
      "Search my documents for …",
      "Add a document …",
      "What do you know about this project?",
      "Save this for later …",
    ],
  },
  agents: {
    label: "Agents",
    icon: Bot,
    hint: "Give a goal. Shuttapy plans, picks tools, runs the steps and checks the result.",
    actions: [
      "Plan and do: …",
      "Run my morning workflow",
      "Show what tools you can use",
    ],
  },
};
