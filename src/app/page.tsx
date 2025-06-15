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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon, Sun, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { PLATFORMS, IMAGE_PLATFORMS } from "@/lib/constants";

// Expanded translations for a fully internationalized page
const translations = {
  en: {
    appTitle: "Promptify by The AI Buddy",
    tagline: "Craft the perfect AI prompt. Describe your idea, choose your platform, and let Promptify refine it for you.",
    apiSectionTitle: "Google AI API Key",
    apiDescription: "To use the AI-powered features, please enter your Google AI API Key. It will be stored locally in your browser.",
    apiPlaceholder: "Enter your Google AI API Key",
    saveKey: "Save Key",
    apiKeySet: "API Key is set. You can now generate prompts.",
    apiKeyNotSet: "API Key not set. AI features are disabled.",
    footerText: `Built with Next.js and Genkit.`,
    lang_en: "English",
    lang_my: "မြန်မာ",
    // Toasts & Notifications
    apiKeySavedTitle: "API Key Saved!",
    apiKeySavedDesc: "Your Google AI API Key has been stored locally.",
    apiKeyClearedTitle: "API Key Cleared",
    apiKeyClearedDesc: "API Key removed. AI features require a key.",
    apiKeyRequiredTitle: "API Key Required",
    apiKeyRequiredDesc: "Please enter your Google AI API Key to generate prompts.",
    promptGeneratedTitle: "Prompt Generated!",
    promptGeneratedDesc: "Your refined prompt is ready.",
    errorGeneratingTitle: "Error Generating Prompt",
    errorInvalidKey: "API Key is invalid or missing required permissions. Please check your key.",
    errorGeneral: "Failed to generate prompt. Please try again or check console.",
    suggestionAppliedTitle: "Suggestion Applied!",
    suggestionAppliedDesc: "Prompt details updated from suggestion.",
    loadedFromHistoryTitle: "Loaded from History",
    loadedFromHistoryDesc: "Prompt details loaded.",
    historyClearedTitle: "History Cleared",
    historyClearedDesc: "Your prompt history has been removed.",
    // ARIA Labels and other text
    toggleTheme: "Toggle theme",
    footerCopyright: "© {year} Promptify by The AI Buddy. All rights reserved.",
  },
  my: {
    appTitle: "Promptify - The AI Buddy",
    tagline: "အကောင်းဆုံး AI Prompt ကိုဖန်တီးပါ။ သင်၏အကြံပြုချက်ကိုဖော်ပြပြီး ပလက်ဖောင်းရွေးပြီး Promptify သည် ပြုပြင်ပေးပါမည်။",
    apiSectionTitle: "Google AI API Key",
    apiDescription: "AI လုပ်ဆောင်ချက်များအသုံးပြုရန် Google AI API Key ထည့်ပါ။ သင့် browser ထဲတွင်သာသိမ်းထားမည်။",
    apiPlaceholder: "သင့် Google AI API Key ကိုထည့်ပါ",
    saveKey: "Key သိမ်းမည်",
    apiKeySet: "API Key ထည့်ပြီးပါပြီ။ ယခု Prompt များကိုဖန်တီးနိုင်ပါသည်။",
    apiKeyNotSet: "API Key မရှိသေးပါ။ AI လုပ်ဆောင်ချက်များအတွက်လိုအပ်ပါသည်။",
    footerText: `Next.js နှင့် Genkit ဖြင့်တည်ဆောက်ထားသည်။`,
    lang_en: "အင်္ဂလိပ်",
    lang_my: "မြန်မာ",
    // Toasts & Notifications
    apiKeySavedTitle: "API Key သိမ်းလိုက်ပါပြီ!",
    apiKeySavedDesc: "သင်၏ Google AI API Key ကို browser ထဲတွင် သိမ်းဆည်းထားပါသည်။",
    apiKeyClearedTitle: "API Key ရှင်းလင်းပြီးပါပြီ",
    apiKeyClearedDesc: "API Key ကိုဖယ်ရှားလိုက်ပါသည်။ AI လုပ်ဆောင်ချက်များအတွက် Key လိုအပ်ပါသည်။",
    apiKeyRequiredTitle: "API Key လိုအပ်သည်",
    apiKeyRequiredDesc: "Prompt ဖန်တီးရန် သင်၏ Google AI API Key ကိုထည့်ပါ။",
    promptGeneratedTitle: "Prompt ဖန်တီးပြီးပါပြီ!",
    promptGeneratedDesc: "သင်၏ ပြုပြင်ပြီးသော prompt အဆင်သင့်ဖြစ်ပါပြီ။",
    errorGeneratingTitle: "Prompt ဖန်တီးရာတွင် အမှားဖြစ်ပွားသည်",
    errorInvalidKey: "API Key သည် မမှန်ကန်ပါ သို့မဟုတ် လိုအပ်သောခွင့်ပြုချက်များမရှိပါ။ သင့် Key ကိုစစ်ဆေးပါ။",
    errorGeneral: "Prompt ကိုဖန်တီးရန်မအောင်မြင်ပါ။ ကျေးဇူးပြု၍ ထပ်ကြိုးစားပါ သို့မဟုတ် console ကိုစစ်ဆေးပါ။",
    suggestionAppliedTitle: "အကြံပြုချက်ကို အသုံးပြုလိုက်ပါပြီ!",
    suggestionAppliedDesc: "Prompt အချက်အလက်များကို အကြံပြုချက်မှ အသစ်ပြောင်းလိုက်ပါသည်။",
    loadedFromHistoryTitle: "မှတ်တမ်းမှ ပြန်ဖွင့်ထားသည်",
    loadedFromHistoryDesc: "Prompt အသေးစိတ်ကို တင်ပြီးပါပြီ။",
    historyClearedTitle: "မှတ်တမ်းကို ရှင်းလင်းပြီးပါပြီ",
    historyClearedDesc: "သင်၏ prompt မှတ်တမ်းကို ဖယ်ရှားလိုက်ပါသည်။",
    // ARIA Labels and other text
    toggleTheme: "Theme ပြောင်းရန်",
    footerCopyright: "© {year} Promptify by The AI Buddy. All rights reserved.",
  }
};

const HISTORY_STORAGE_KEY = "promptifyHistory";
const API_KEY_STORAGE_KEY = "promptifyApiKey";
const LANGUAGE_STORAGE_KEY = "promptifyLanguage";

type Language = keyof typeof translations;

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
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) setHistory(JSON.parse(storedHistory));
      
      const storedTheme = localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setCurrentTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");

      const storedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
      if (storedApiKey) {
        setUserApiKey(storedApiKey);
        setIsApiKeySet(true);
      }
      
      const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      if (storedLanguage && translations[storedLanguage]) {
        setLanguage(storedLanguage);
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
      toast({ title: t.apiKeySavedTitle, description: t.apiKeySavedDesc });
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      setIsApiKeySet(false);
      toast({ variant: "destructive", title: t.apiKeyClearedTitle, description: t.apiKeyClearedDesc });
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
        title: t.apiKeyRequiredTitle,
        description: t.apiKeyRequiredDesc,
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
        ...values,
        refinedPrompt: result.refinedPrompt,
        timestamp: Date.now(),
      };
      saveHistory([newEntry, ...history.slice(0, 19)]);
      toast({ title: t.promptGeneratedTitle, description: t.promptGeneratedDesc });
    } catch (error: any) {
      console.error("Error refining prompt:", error);
      const isAuthError = error.message?.includes("API key not valid") || error.message?.includes("PERMISSION_DENIED");
      const errorMessage = isAuthError ? t.errorInvalidKey : t.errorGeneral;
      toast({
        variant: "destructive",
        title: t.errorGeneratingTitle,
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
    toast({ title: t.suggestionAppliedTitle, description: t.suggestionAppliedDesc });
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
    toast({ title: t.loadedFromHistoryTitle, description: t.loadedFromHistoryDesc });
  };

  const handleClearHistory = () => {
    saveHistory([]);
    toast({ title: t.historyClearedTitle, description: t.historyClearedDesc });
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLangChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  };

  return (
    <div className="flex flex-col min-h-screen items-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 transition-colors duration-300">
      <header className="w-full max-w-6xl mb-8 sm:mb-12 flex justify-between items-center">
        <div className="flex items-center">
          <PromptifyLogo className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          <h1 className="ml-3 text-2xl sm:text-4xl font-bold font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-foreground/80">
            {t.appTitle}
          </h1>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2">
            <Button variant={language === 'en' ? "secondary" : "ghost"} size="sm" onClick={() => handleLangChange('en')}>{t.lang_en}</Button>
            <Button variant={language === 'my' ? "secondary" : "ghost"} size="sm" onClick={() => handleLangChange('my')}>{t.lang_my}</Button>
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={t.toggleTheme}>
                <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>
      </header>
      <p className="text-center text-muted-foreground mb-6 text-md sm:text-lg max-w-2xl">
        {t.tagline}
      </p>

      <Card className="w-full max-w-md mb-10 bg-card/60 backdrop-blur-xl border border-border/20 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-xl font-headline">
            <KeyRound className="mr-2 h-6 w-6 text-primary" />
            {t.apiSectionTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t.apiDescription}
          </p>
          <div className="flex items-center space-x-2">
            <Input
              id="apiKey"
              type="password"
              value={userApiKey}
              onChange={handleApiKeyChange}
              placeholder={t.apiPlaceholder}
              className="bg-background/70 focus:bg-background"
            />
            <Button onClick={saveApiKey}>{t.saveKey}</Button>
          </div>
          {isApiKeySet ? (
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center"><CheckCircle2 className="mr-1 h-4 w-4" />{t.apiKeySet}</p>
          ) : (
            <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center"><AlertTriangle className="mr-1 h-4 w-4" />{t.apiKeyNotSet}</p>
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
            translations={t}
            language={language}
          />
          <PromptOutput 
            refinedPrompt={refinedPrompt} 
            isLoading={isLoading}
            translations={t}
            language={language}
           />
        </section>

        <PromptSuggestions 
            onSuggestionClick={handleSuggestionClick}
            translations={t}
            language={language}
        />

        <PromptHistory
          history={history}
          onSelectHistory={handleSelectHistory}
          onClearHistory={handleClearHistory}
          translations={t}
          language={language}
        />
      </main>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          {t.footerCopyright.replace('{year}', new Date().getFullYear().toString())}
        </p>
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
