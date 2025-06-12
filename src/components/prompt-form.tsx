
"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Bot, Image as ImageIcon, Palette, Wind, Aperture } from "lucide-react";
import { PLATFORMS, IMAGE_PLATFORMS } from "@/lib/constants";
import type { RefinePromptInput } from "@/ai/flows/refine-prompt";

// Form schema does not include apiKey as it's handled at a higher level
const formSchema = z.object({
  roughPrompt: z.string().min(10, {
    message: "Prompt description must be at least 10 characters.",
  }).max(1000, {
    message: "Prompt description must not exceed 1000 characters.",
  }),
  platform: z.string().min(1, { message: "Please select a platform." }),
  photoBackground: z.string().max(500, "Background details should not exceed 500 characters.").optional(),
  photoElements: z.string().max(500, "Key elements description should not exceed 500 characters.").optional(),
  photoColorPalette: z.string().max(300, "Color palette description should not exceed 300 characters.").optional(),
  photoStyle: z.string().max(300, "Artistic style description should not exceed 300 characters.").optional(),
});

export type PromptFormValues = z.infer<typeof formSchema>;

interface PromptFormProps {
  onSubmit: (values: Omit<RefinePromptInput, 'apiKey'>) => Promise<void>;
  isLoading: boolean;
  initialValues?: Partial<PromptFormValues>;
  isApiKeySet: boolean; // To disable button if API key is not set
}

export function PromptForm({ onSubmit, isLoading, initialValues, isApiKeySet }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roughPrompt: initialValues?.roughPrompt || "",
      platform: initialValues?.platform || PLATFORMS[0],
      photoBackground: initialValues?.photoBackground || "",
      photoElements: initialValues?.photoElements || "",
      photoColorPalette: initialValues?.photoColorPalette || "",
      photoStyle: initialValues?.photoStyle || "",
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        roughPrompt: initialValues.roughPrompt || "",
        platform: initialValues.platform || PLATFORMS[0],
        photoBackground: initialValues.photoBackground || "",
        photoElements: initialValues.photoElements || "",
        photoColorPalette: initialValues.photoColorPalette || "",
        photoStyle: initialValues.photoStyle || "",
      });
    }
  }, [initialValues, form]);

  const selectedPlatform = form.watch("platform");
  const isImagePlatform = IMAGE_PLATFORMS.includes(selectedPlatform);

  const handleSubmit = async (values: PromptFormValues) => {
    await onSubmit(values); // API key is added by the parent component
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/20 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-headline">
          <Bot className="mr-2 h-7 w-7 text-primary" />
          Describe Your Idea
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="roughPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Core Idea / Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A cat astronaut, a new app logo, a poem about spring..."
                      className="min-h-[100px] resize-y bg-background/70 focus:bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    What kind of prompt do you need? Be descriptive.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Platform</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/70 focus:bg-background">
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PLATFORMS.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the AI platform this prompt is for.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isImagePlatform && (
              <div className="space-y-6 pt-4 border-t border-border/30">
                <h3 className="text-lg font-medium text-foreground flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-accent-foreground" />
                  Image Details (Optional)
                </h3>
                <FormField
                  control={form.control}
                  name="photoBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Wind className="mr-2 h-4 w-4 text-muted-foreground" />Background</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Dark forest, futuristic cityscape, minimalist studio" {...field} className="min-h-[60px] bg-background/70 focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoElements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Aperture className="mr-2 h-4 w-4 text-muted-foreground" />Key Elements / Subjects</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., A majestic dragon, two characters interacting, a specific object" {...field} className="min-h-[60px] bg-background/70 focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoColorPalette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Palette className="mr-2 h-4 w-4 text-muted-foreground" />Color Palette / Mood</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Warm autumn tones, neon cyberpunk, monochromatic blue, eerie and dark" {...field} className="min-h-[60px] bg-background/70 focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />Artistic Style</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Photorealistic, anime, watercolor, pixel art, impressionistic" {...field} className="min-h-[60px] bg-background/70 focus:bg-background" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading || !isApiKeySet}>
              {isLoading ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : !isApiKeySet ? (
                 <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Set API Key to Generate
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Prompt
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
