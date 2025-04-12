import React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Todo List Chrome Extension</title>
      </head>
      <body className="bg-background text-foreground">
        <div className="container mx-auto max-w-2xl">{children}</div>
      </body>
    </html>
  );
}
