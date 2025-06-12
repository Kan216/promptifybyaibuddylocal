"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROMPT_CATEGORIES } from "@/lib/constants";
import type { PromptSuggestion } from "@/types";
import { Lightbulb, ChevronRight } from "lucide-react";

interface PromptSuggestionsProps {
  onSuggestionClick: (suggestion: PromptSuggestion) => void;
}

export function PromptSuggestions({ onSuggestionClick }: PromptSuggestionsProps) {
  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/20 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Lightbulb className="mr-2 h-7 w-7 text-primary" />
          Prompt Ideas & Examples
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {PROMPT_CATEGORIES.map((category, index) => (
            <AccordionItem value={`item-${index}`} key={category.name}>
              <AccordionTrigger className="text-lg hover:no-underline">
                <div className="flex items-center">
                  {category.icon && <category.icon className="mr-3 h-5 w-5 text-muted-foreground" />}
                  {category.name}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pl-2">
                  {category.examples.map((example) => (
                    <li key={example.title} className="group">
                      <div className="font-medium text-foreground/90">{example.title}</div>
                      <p className="text-sm text-muted-foreground mb-1">{example.description}</p>
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 h-auto text-primary group-hover:text-accent-foreground"
                        onClick={() => onSuggestionClick(example)}
                      >
                        Use this example <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
