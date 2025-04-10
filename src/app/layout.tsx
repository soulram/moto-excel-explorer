
import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import '../index.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Motorcycle Database</title>
        <meta name="description" content="Motorcycle Database Management System" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
