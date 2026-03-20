import type { Metadata } from 'next';
import './globals.css';
import React from 'react';
import { Inter, Dongle, Orbitron } from 'next/font/google';
import { cn } from '@/lib/utils';
import { TooltipProvider } from "@/src/components/ui/tooltip"
import { SidebarLayout } from "@/src/components/sidebar-layout"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const dongle = Dongle({ weight: ['300', '400', '700'], subsets: ['latin'], variable: '--font-dongle' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });

export const metadata: Metadata = {
  title: 'lu work ai',
  description: 'lu work ai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={cn('font-sans', inter.variable, dongle.variable, orbitron.variable)}>
      <body>
        <TooltipProvider>
          <SidebarLayout>
            {children}
          </SidebarLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}
