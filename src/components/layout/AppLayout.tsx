import React from "react";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-secondary dark:bg-background">
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <footer className="py-4 px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>AI responses may be inaccurate. Please verify important information. There is a limit on the number of requests that can be made to the AI servers.</p>
      </footer>
    </div>
  );
}