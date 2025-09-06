import { ActivityIcon, Clipboard, Upload } from "lucide-react";
import { Outlet, useNavigate } from "react-router";

import type { Route } from "./+types/activities";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
            Workbase
          </h1>
          <p className="text-muted-foreground text-lg">
            Your personal productivity hub for tracking activities, sharing
            clipboard, and managing files
          </p>
        </div>

        <div className="flex flex-col gap-y-8">
          <Tabs defaultValue="activities" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm border border-border/50 h-auto">
              <TabsTrigger
                value="activities"
                className="flex items-center gap-2"
                onClick={() => {
                  navigate("/");
                }}
              >
                <ActivityIcon className="h-4 w-4" />
                Activities
              </TabsTrigger>
              <TabsTrigger
                value="clipboard"
                className="flex items-center gap-2"
                onClick={() => {
                  navigate("/clipboard");
                }}
              >
                <Clipboard className="h-4 w-4" />
                Clipboard
              </TabsTrigger>
              <TabsTrigger
                value="files"
                className="flex items-center gap-2"
                onClick={() => {
                  navigate("/");
                }}
              >
                <Upload className="h-4 w-4" />
                Files
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
