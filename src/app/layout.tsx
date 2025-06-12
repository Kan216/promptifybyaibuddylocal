import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google'; // Import Next Fonts
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

// Configure fonts
const fontInter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter', // CSS variable for Inter
});

const fontSourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro', // CSS variable for Source Code Pro
});

export const metadata: Metadata = {
  title: 'Promptify by The AI Buddy',
  description: 'Your AI Prompt Engineering Assistant by The AI Buddy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts links are managed by next/font, no need for manual <link> tags here */}
      </head>
      <body 
        className={cn(
          "font-body antialiased",
          fontInter.variable, 
          fontSourceCodePro.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
