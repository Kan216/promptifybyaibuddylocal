
"use client";

import { useState, useEffect, useCallback } from "react";
import { PromptForm, type PromptFormValues } from "@/components/prompt-form";
import { PromptOutput } from "@/components/prompt-output";
import { PromptSuggestions } from "@/components/prompt-suggestions";
import { PromptHistory } from "@/components/prompt-history";
import { refinePrompt, type RefinePromptInput } from "@/ai/flows/refine-prompt";
import type { PromptHistoryEntry, PromptSuggestion } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { PromptifyLogo } from "@/components/icons/PromptifyLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PLATFORMS, IMAGE_PLATFORMS } from "@/lib/constants";

const HISTORY_STORAGE_KEY = "promptifyHistory";
const API_KEY_STORAGE_KEY = "promptifyApiKey";

export default function PromptifyPage() {
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const [currentFormValues, setCurrentFormValues] = useState<Partial<PromptFormValues>>({
    roughPrompt: "",
    platform: PLATFORMS[0],
    photoBackground: "",
    photoElements: "",
    photoColorPalette: "",
    photoStyle: "",
  });
  const [refinedPrompt, setRefinedPrompt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<PromptHistoryEntry[]>([]);
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
      const storedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setCurrentTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");

      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setUserApiKey(storedApiKey);
        setIsApiKeySet(true);
      }
    }
  }, []);

  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserApiKey(event.target.value);
  };

  const saveApiKey = () => {
    if (userApiKey.trim() !== "") {
      localStorage.setItem(API_KEY_STORAGE_KEY, userApiKey.trim());
      setIsApiKeySet(true);
      toast({ title: "API Key Saved!", description: "Your Google AI API Key has been stored locally." });
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setIsApiKeySet(false);
      toast({ variant: "destructive", title: "API Key Cleared", description: "API Key removed. AI features require a key." });
    }
  };

  const saveHistory = useCallback((newHistory: PromptHistoryEntry[]) => {
    setHistory(newHistory);
    if (typeof window !== "undefined") {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
    }
  }, []);

  const handleGeneratePrompt = async (values: Omit<RefinePromptInput, 'apiKey'>) => {
    if (!isApiKeySet || !userApiKey) {
      toast({
        variant: "destructive",
        title: "API Key Required",
        description: "Please enter your Google AI API Key to generate prompts.",
      });
      return;
    }
    setIsLoading(true);
    setRefinedPrompt(null);
    try {
      const fullInput: RefinePromptInput = { ...values, apiKey: userApiKey };
      const result = await refinePrompt(fullInput);
      setRefinedPrompt(result.refinedPrompt);
      const newEntry: PromptHistoryEntry = {
        id: new Date().toISOString(),
        roughPrompt: values.roughPrompt,
        platform: values.platform,
        refinedPrompt: result.refinedPrompt,
        timestamp: Date.now(),
        photoBackground: values.photoBackground,
        photoElements: values.photoElements,
        photoColorPalette: values.photoColorPalette,
        photoStyle: values.photoStyle,
      };
      saveHistory([newEntry, ...history.slice(0, 19)]);
      toast({ title: "Prompt Generated!", description: "Your refined prompt is ready." });
    } catch (error: any) {
      console.error("Error refining prompt:", error);
      const errorMessage = error.message?.includes("API key not valid") || error.message?.includes("PERMISSION_DENIED")
        ? "API Key is invalid or missing required permissions. Please check your key."
        : "Failed to generate prompt. Please try again or check console.";
      toast({
        variant: "destructive",
        title: "Error Generating Prompt",
        description: errorMessage,
      });
      setRefinedPrompt(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: PromptSuggestion) => {
    setCurrentFormValues(prev => ({
      ...prev,
      roughPrompt: suggestion.description,
      platform: suggestion.platform,
      photoBackground: IMAGE_PLATFORMS.includes(suggestion.platform) ? prev.photoBackground : "",
      photoElements: IMAGE_PLATFORMS.includes(suggestion.platform) ? prev.photoElements : "",
      photoColorPalette: IMAGE_PLATFORMS.includes(suggestion.platform) ? prev.photoColorPalette : "",
      photoStyle: IMAGE_PLATFORMS.includes(suggestion.platform) ? prev.photoStyle : "",
    }));
    setRefinedPrompt(null);
    toast({ title: "Suggestion Applied!", description: "Prompt details updated from suggestion." });
  };

  const handleSelectHistory = (entry: PromptHistoryEntry) => {
    setCurrentFormValues({
      roughPrompt: entry.roughPrompt,
      platform: entry.platform,
      photoBackground: entry.photoBackground || "",
      photoElements: entry.photoElements || "",
      photoColorPalette: entry.photoColorPalette || "",
      photoStyle: entry.photoStyle || "",
    });
    setRefinedPrompt(entry.refinedPrompt);
    toast({ title: "Loaded from History", description: "Prompt details loaded." });
  };

  const handleClearHistory = () => {
    saveHistory([]);
    toast({ title: "History Cleared", description: "Your prompt history has been removed." });
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 transition-colors duration-300">
      <header className="w-full max-w-6xl mb-8 sm:mb-12 flex justify-between items-center">
        <div className="flex items-center">
          <PromptifyLogo className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="ml-3 text-3xl sm:text-5xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-foreground/80">
            Promptify by The AI Buddy
          </h1>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </header>
      <p className="text-center text-muted-foreground mb-6 text-md sm:text-lg max-w-2xl">
        Craft the perfect AI prompt. Describe your idea, choose your platform, and let Promptify refine it for you.
      </p>

      <Card className="w-full max-w-md mb-10 bg-card/60 backdrop-blur-xl border border-border/20 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <KeyRound className="mr-2 h-6 w-6 text-primary" />
            Google AI API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            To use the AI-powered features, please enter your Google AI API Key. It will be stored locally in your browser.
          </p>
          <div className="flex items-center space-x-2">
            <Input
              id="apiKey"
              type="password"
              value={userApiKey}
              onChange={handleApiKeyChange}
              placeholder="Enter your Google AI API Key"
              className="bg-background/70 focus:bg-background"
            />
            <Button onClick={saveApiKey}>Save Key</Button>
          </div>
          {isApiKeySet ? (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center"><CheckCircle2 className="mr-1 h-4 w-4" />API Key is set. You can now generate prompts.</p>
          ) : (
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />API Key not set. AI features are disabled.</p>
          )}
        </CardContent>
      </Card>

      <main className="w-full max-w-6xl space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <PromptForm
            onSubmit={handleGeneratePrompt}
            isLoading={isLoading}
            initialValues={currentFormValues}
            isApiKeySet={isApiKeySet}
          />
          <PromptOutput refinedPrompt={refinedPrompt} isLoading={isLoading} />
        </section>

        <PromptSuggestions onSuggestionClick={handleSuggestionClick} />

        <PromptHistory
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
        />
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Promptify by The AI Buddy. Built with Next.js and Genkit.</p>
      </footer>
    </div>
  );
}
