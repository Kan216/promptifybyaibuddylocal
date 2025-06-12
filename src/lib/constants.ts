import type { PromptCategory } from '@/types';
import { BookText, Palette, Code2, Zap, BrainCircuit } from 'lucide-react';

export const PLATFORMS = ["ChatGPT", "MidJourney", "DALL·E", "Stable Diffusion", "Gemini", "Claude", "Other"];

export const IMAGE_PLATFORMS = ["MidJourney", "DALL·E", "Stable Diffusion"];

export const PROMPT_CATEGORIES: PromptCategory[] = [
  {
    name: "AI Art & Imagery",
    icon: Palette,
    examples: [
      { title: "Surreal Landscape", description: "A dreamlike landscape with floating islands, bioluminescent flora, and twin moons in a starry sky.", platform: "MidJourney" },
      { title: "Cyberpunk Character Concept", description: "Detailed full-body concept art of a cyborg hacker with neon augmentations, wearing futuristic street fashion, in a rain-slicked city.", platform: "DALL·E" },
      { title: "Photorealistic Food", description: "A close-up, high-detail photograph of a gourmet burger with melted cheese and fresh toppings, on a rustic wooden table.", platform: "Stable Diffusion" },
    ],
  },
  {
    name: "Creative Writing",
    icon: BookText,
    examples: [
      { title: "Sci-Fi Story Opening", description: "The first paragraph of a science fiction story about the last human colony searching for a new home among the stars.", platform: "ChatGPT" },
      { title: "Poem about the Ocean", description: "A four-stanza rhyming poem (ABAB) capturing the mystery and power of the deep ocean.", platform: "Claude" },
      { title: "Character Dialogue", description: "A short, witty dialogue exchange between a cynical detective and an overly optimistic witness.", platform: "ChatGPT" },
    ],
  },
  {
    name: "Coding & Development",
    icon: Code2,
    examples: [
      { title: "Python Data Scraping Script", description: "Generate a Python script using BeautifulSoup and Requests to scrape all H2 headings from a given URL.", platform: "ChatGPT" },
      { title: "React Component for User Profile", description: "Outline the TypeScript code for a React functional component that displays a user's avatar, name, and bio.", platform: "Gemini" },
      { title: "SQL Query for Sales Data", description: "Write an SQL query to find the top 5 products by total sales revenue in the last quarter from 'sales' and 'products' tables.", platform: "ChatGPT" },
    ],
  },
  {
    name: "Productivity & Business",
    icon: Zap,
    examples: [
      { title: "Marketing Email Subject Lines", description: "Generate 5 catchy email subject lines for a new productivity app launch.", platform: "ChatGPT" },
      { title: "SWOT Analysis Structure", description: "Provide a template for a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for a small e-commerce business.", platform: "Claude" },
      { title: "Meeting Summary", description: "Summarize a 1-hour project update meeting based on provided bullet points (input meeting notes here).", platform: "Gemini" },
    ],
  },
  {
    name: "General Knowledge & Brainstorming",
    icon: BrainCircuit,
    examples: [
      { title: "Explain Quantum Entanglement", description: "Explain the concept of quantum entanglement in simple terms, suitable for a high school student.", platform: "ChatGPT" },
      { title: "Brainstorm Party Themes", description: "List 10 unique and fun themes for a 30th birthday party.", platform: "Claude" },
      { title: "Pros and Cons of Remote Work", description: "Outline the main pros and cons of remote work for both employees and employers.", platform: "Gemini" },
    ],
  },
];
