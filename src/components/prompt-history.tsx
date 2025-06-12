"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PromptHistoryEntry } from "@/types";
import { History, Trash2, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface PromptHistoryProps {
  history: PromptHistoryEntry[];
  onSelectHistory: (entry: PromptHistoryEntry) => void;
  onClearHistory: () => void;
}

export function PromptHistory({ history, onSelectHistory, onClearHistory }: PromptHistoryProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card className="bg-card/60 backdrop-blur-xl border border-border/20 shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-headline">
            <History className="mr-2 h-7 w-7 text-primary" />
            Prompt History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/20 shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-2xl font-headline">
          <History className="mr-2 h-7 w-7 text-primary" />
          Prompt History
        </CardTitle>
        {history.length > 0 && (
          <Button variant="ghost" size="icon" onClick={onClearHistory} aria-label="Clear history">
            <Trash2 className="h-5 w-5" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <p className="text-muted-foreground">No prompts generated yet. Your history will appear here.</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <ul className="space-y-4">
              {history.map((entry) => (
                <li key={entry.id} className="p-3 border border-border/50 rounded-lg bg-background/50 hover:bg-accent/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-xs" title={entry.roughPrompt}>
                        Input: {entry.roughPrompt}
                      </p>
                      <p className="text-xs text-muted-foreground">Platform: {entry.platform}</p>
                       <p className="text-xs text-muted-foreground mt-1">
                        Generated: {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectHistory(entry)}
                      className="ml-2 shrink-0"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" /> Use
                    </Button>
                  </div>
                  <CardDescription className="mt-2 text-xs text-muted-foreground line-clamp-2" title={entry.refinedPrompt}>
                    Output: <span className="font-code">{entry.refinedPrompt}</span>
                  </CardDescription>
                </li>
              ))}
            </ul>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
