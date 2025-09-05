import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { saveActivity, type Activity } from "~/lib/storage";
import { Plus } from "lucide-react";

interface ActivityFormProps {
  onActivityAdded: (activity: Activity) => void;
}

export function ActivityForm({ onActivityAdded }: ActivityFormProps) {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const activity = saveActivity({ content: content.trim(), date });
      onActivityAdded(activity);
      setContent("");
      setDate(new Date().toISOString().split("T")[0]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Add Activity
          </h2>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="date"
            className="text-sm font-medium text-muted-foreground"
          >
            Date
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-background/50 border-border/50"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="content"
            className="text-sm font-medium text-muted-foreground"
          >
            What did you do? (Markdown supported)
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Describe your activity... You can use **bold**, *italic*, and [links](https://example.com)"
            className="min-h-[120px] bg-background/50 border-border/50 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <Button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
        >
          {isSubmitting ? "Adding..." : "Add Activity"}
        </Button>
      </form>
    </Card>
  );
}
