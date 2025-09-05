import type React from "react";
import { Clipboard as ClipboardIcon } from "lucide-react";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { saveClipboard, type ClipboardItem } from "~/lib/storage";

export default function Clipboard() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const item = saveClipboard(content.trim());
      // onItemAdded(item);
      setContent("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContent(text);
      }
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  return (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardIcon className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Add to Clipboard
          </h2>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="content"
            className="text-sm font-medium text-muted-foreground"
          >
            Content
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type content to share across devices..."
            className="min-h-[120px] bg-background/50 border-border/50 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handlePaste}
            className="flex-1 bg-background/50 border-border/50 hover:bg-accent/50 transition-all duration-200"
          >
            Paste from Clipboard
          </Button>
          <Button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
          >
            {isSubmitting ? "Adding..." : "Add to Shared Clipboard"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
