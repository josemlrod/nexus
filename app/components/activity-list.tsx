import { useState, useMemo } from "react";
import { useMutation } from "convex/react";
import { Calendar, Trash2, Filter } from "lucide-react";
import type { FunctionReturnType } from "convex/server";

import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  format,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel.d.ts";

type Activities = FunctionReturnType<typeof api.activities.get>;

interface ActivityListProps {
  activities?: Activities;
}

type FilterType = "all" | "today" | "week" | "month";

export function ActivityList({ activities = [] }: ActivityListProps) {
  const deleteActivity = useMutation(api.activities.deleteActivity);
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredActivities = useMemo(() => {
    if (filter === "all") return activities;

    const now = new Date();
    const today = format(now, "yyyy-MM-dd");

    return activities.filter((activity) => {
      const activityDate = format(
        new Date(activity._creationTime),
        "yyyy-MM-dd",
      );

      switch (filter) {
        case "today":
          return activityDate === today;
        case "week":
          return isWithinInterval(new Date(activity._creationTime), {
            start: startOfWeek(now, { weekStartsOn: 1 }),
            end: endOfWeek(now, { weekStartsOn: 1 }),
          });
        case "month":
          return isWithinInterval(new Date(activity._creationTime), {
            start: startOfMonth(now),
            end: endOfMonth(now),
          });
        default:
          return true;
      }
    });
  }, [activities, filter]);

  const handleDelete = (id: Id<"activities">) => {
    deleteActivity({ id });
  };

  const renderMarkdown = (content: string) => {
    // Simple markdown rendering
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /\[([^\]]+)\]$$([^)]+)$$/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
      );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Activities</h2>
          <Badge variant="outline">{filteredActivities.length}</Badge>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={filter}
            onValueChange={(value: FilterType) => setFilter(value)}
          >
            <SelectTrigger className="w-32 bg-background/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <Card className="p-8 text-center border-border/50 bg-card/30">
            <p className="text-muted-foreground">
              No activities found for the selected period.
            </p>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <Card
              key={activity._id}
              className="p-4 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs bg-background/50"
                    >
                      {format(new Date(activity._creationTime), "MMM dd, yyyy")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(activity._creationTime), "HH:mm")}
                    </span>
                  </div>
                  <div
                    className="text-sm text-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdown(activity.text),
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(activity._id)}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
