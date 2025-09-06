import { ActivityIcon, Clipboard, Upload } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import type { Route } from "./+types/activities";
import { Button } from "~/components/ui/button";
import clsx from "clsx";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Layout() {
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
          <div className="grid w-full grid-cols-3 gap-x-1 bg-card/50 backdrop-blur-sm border border-border/50 h-auto rounded-lg p-1">
            <Button variant="ghost" size="sm" className="p-0">
              <NavLink
                to="/"
                className={({ isActive }) => {
                  return clsx(
                    "flex gap-x-2 w-full h-full rounded-md items-center justify-center",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  );
                }}
              >
                <ActivityIcon className="h-4 w-4" />
                Activities
              </NavLink>
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <NavLink
                to="/clipboard"
                className={({ isActive }) => {
                  return clsx(
                    "flex gap-x-2 w-full h-full rounded-md items-center justify-center",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  );
                }}
              >
                <Clipboard className="h-4 w-4" />
                Clipboard
              </NavLink>
            </Button>
            <Button variant="ghost" size="sm" className="p-0">
              <NavLink
                to="/files"
                className={({ isActive }) => {
                  return clsx(
                    "flex gap-x-2 w-full h-full rounded-md items-center justify-center",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground",
                  );
                }}
              >
                <Upload className="h-4 w-4" />
                Files
              </NavLink>
            </Button>
          </div>

          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
