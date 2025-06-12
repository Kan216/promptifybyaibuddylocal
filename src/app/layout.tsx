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
        <!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NGRBGWDD');</script>
<!-- End Google Tag Manager -->
        {/* Google Fonts links are managed by next/font, no need for manual <link> tags here */}
      </head>
      <body 
        className={cn(
          "font-body antialiased",
          fontInter.variable, 
          fontSourceCodePro.variable
        )}
      >
        <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGRBGWDD"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
        {children}
        <Toaster />
      </body>
    </html>
  );
}
