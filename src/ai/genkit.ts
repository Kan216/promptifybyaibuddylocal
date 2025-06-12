import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize Genkit.
// For the refinePromptFlow, if a user provides an API key,
// that flow will dynamically create its own Genkit runtime with that key.
// If GOOGLE_API_KEY is set in the environment, this global `ai` instance
// could be used by other flows or features that don't rely on user-provided keys.
// If no GOOGLE_API_KEY is set, calls using this global `ai` directly for Google AI models would fail.
export const ai = genkit({
  plugins: [
    googleAI(), // Attempts to use GOOGLE_API_KEY from env or Application Default Credentials
  ],
  // Default model for the global `ai` instance, not necessarily used by flows with dynamic configuration.
  model: 'googleai/gemini-2.0-flash',
});
