
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import '../index.css';

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
      <body>
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
