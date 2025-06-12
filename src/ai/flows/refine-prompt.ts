
'use server';

/**
 * @fileOverview Refines a user's rough prompt idea into a well-structured prompt optimized for a selected platform,
 * potentially incorporating additional visual details for image generation platforms.
 * Requires a user-provided Google AI API key.
 *
 * - refinePrompt - A function that takes a rough prompt, target platform, API key, and optional visual details, then returns a refined prompt.
 * - RefinePromptInput - The input type for the refinePrompt function.
 * - RefinePromptOutput - The return type for the refinePrompt function.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod'; // Using zod directly for schema defs
import { ai as globalAi } from '@/ai/genkit'; // For ai.defineFlow structure
import type { Flow } from 'genkit/flow';


const RefinePromptInputSchema = z.object({
  roughPrompt: z
    .string()
    .min(1, { message: "Rough prompt cannot be empty."})
    .describe('The user-provided rough prompt idea.'),
  platform: z
    .string()
    .min(1, { message: "Platform cannot be empty."})
    .describe('The target platform for the prompt (e.g., Midjourney, ChatGPT).'),
  apiKey: z
    .string()
    .min(1, { message: "API Key is required."})
    .describe("User's Google AI API Key."),
  photoBackground: z
    .string()
    .optional()
    .describe('Optional: Desired background for an image prompt.'),
  photoElements: z
    .string()
    .optional()
    .describe('Optional: Key elements or subjects for an image prompt.'),
  photoColorPalette: z
    .string()
    .optional()
    .describe('Optional: Preferred color palette or mood for an image prompt.'),
  photoStyle: z
    .string()
    .optional()
    .describe('Optional: Desired artistic style (e.g., photorealistic, cartoon, watercolor) for an image prompt.'),
});
export type RefinePromptInput = z.infer<typeof RefinePromptInputSchema>;

const RefinePromptOutputSchema = z.object({
  refinedPrompt: z
    .string()
    .describe('The AI-refined, well-structured prompt optimized for the selected platform.'),
});
export type RefinePromptOutput = z.infer<typeof RefinePromptOutputSchema>;

// Helper function to build the prompt string manually
function buildPromptText(input: RefinePromptInput): string {
  let promptStr = `You are a senior-level AI prompt engineer with deep expertise in language model behavior, prompt structuring, and output optimization. Your core responsibility is to take rough or loosely defined user ideas—whether minimal text, unclear goals, or partial visual descriptions—and transform them into high-performance, structured prompts that guide the AI toward accurate, creative, and context-aware responses.

You skillfully extract intent from ambiguous input, apply best practices for prompt design (instructional clarity, tone control, role setting, output formatting), and fine-tune prompts based on the target AI platform (e.g., ChatGPT, Midjourney, Claude, DALL·E). Where applicable, you incorporate technical constraints, stylistic guidelines, and user-provided assets (e.g., reference images, descriptions, tone preferences) to maximize relevance and precision.

Your output should always meet the following standards:

Clear and unambiguous structure

Aligned with user intent and platform constraints

Optimized for creativity, coherence, and completeness

Adaptable for iterative refinement or automation

You approach each task with both creative and analytical rigor—balancing brevity with depth, flexibility with control, and language nuance with logic. Your goal is not just to generate prompts, but to engineer reliable instructions that consistently produce exceptional AI-generated results..

User's Rough Prompt Idea: ${input.roughPrompt}
Target Platform: ${input.platform}`;

  if (input.photoBackground) {
    promptStr += `\nVisual Detail - Background: ${input.photoBackground}`;
  }
  if (input.photoElements) {
    promptStr += `\nVisual Detail - Key Elements: ${input.photoElements}`;
  }
  if (input.photoColorPalette) {
    promptStr += `\nVisual Detail - Color Palette: ${input.photoColorPalette}`;
  }
  if (input.photoStyle) {
    promptStr += `\nVisual Detail - Artistic Style: ${input.photoStyle}`;
  }

  promptStr += `\n\nBased on all the information above, generate the refined prompt. If visual details are provided, integrate them naturally into the main prompt, especially if the target platform is for image generation. Do not list the visual details separately in your final output.\nRefined Prompt:`;
  return promptStr;
}


const refinePromptFlow: Flow<typeof RefinePromptInputSchema, typeof RefinePromptOutputSchema> = globalAi.defineFlow(
  {
    name: 'refinePromptFlow',
    inputSchema: RefinePromptInputSchema,
    outputSchema: RefinePromptOutputSchema,
  },
  async (input) => {
    // API key is mandatory, validated by Zod schema.

    // Create a temporary Genkit plugin instance configured with the user's API key.
    const userConfiguredGoogleAI = googleAI({ apiKey: input.apiKey });

    // Create a temporary, lightweight Genkit runtime for this request.
    const tempRuntime = genkit({
        plugins: [userConfiguredGoogleAI], // This plugin instance has the user's API key
    });

    const builtPrompt = buildPromptText(input);

    const { output } = await tempRuntime.generate({
        model: 'googleai/gemini-2.0-flash', // Specify the model; it will be served by userConfiguredGoogleAI
        prompt: builtPrompt,
        output: { schema: RefinePromptOutputSchema },
    });

    if (!output) {
        throw new Error('AI did not return a response.');
    }
    return output;
  }
);

export async function refinePrompt(input: RefinePromptInput): Promise<RefinePromptOutput> {
  // Input validation (including apiKey presence) is handled by Zod in defineFlow.
  return refinePromptFlow(input);
}
