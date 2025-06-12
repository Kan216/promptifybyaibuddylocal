"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ClipboardCopy, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PromptOutputProps {
  refinedPrompt: string | null;
  isLoading: boolean;
}

export function PromptOutput({ refinedPrompt, isLoading }: PromptOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    if (refinedPrompt) {
      try {
        await navigator.clipboard.writeText(refinedPrompt);
        setCopied(true);
        toast({
          title: "Copied to clipboard!",
          description: "The refined prompt has been copied.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy: ", err);
        toast({
          variant: "destructive",
          title: "Copy failed",
          description: "Could not copy the prompt to clipboard.",
        });
      }
    }
  };
  
  // Effect to clear output when new generation starts if needed, or rely on parent state
  // For now, simply display what's passed.

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/20 shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-2xl font-headline">
          <Sparkles className="mr-2 h-7 w-7 text-primary" />
          Refined Prompt
        </CardTitle>
        {refinedPrompt && !isLoading && (
          <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy prompt">
            {copied ? <Check className="h-5 w-5 text-green-500" /> : <ClipboardCopy className="h-5 w-5" />}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Textarea
          readOnly
          value={isLoading ? "Generating your prompt..." : refinedPrompt || "Your refined prompt will appear here..."}
          className="min-h-[200px] resize-none bg-background/70 font-code text-sm focus:bg-background"
          aria-label="Refined prompt output"
        />
        {refinedPrompt && !isLoading && (
           <Button onClick={handleCopy} className="w-full mt-4">
            {copied ? <Check className="mr-2 h-4 w-4" /> : <ClipboardCopy className="mr-2 h-4 w-4" />}
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
