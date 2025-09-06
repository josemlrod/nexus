import type React from "react";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Clipboard as ClipboardIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel.d.ts";

export default function Clipboard() {
  const clipboard = useQuery(api.clipboard.get);
  const updateClipboard = useMutation(api.clipboard.updateClipboard);

  console.log("clipboard", clipboard);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id") as Id<"clipboard">;
    const text = formData.get("text") as string;

    if (!text.trim()) return;

    try {
      setIsSubmitting(true);
      await updateClipboard({ id: id ? id : undefined, text });
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (textAreaRef.current) textAreaRef.current.textContent = text;
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

        <input
          className="hidden"
          name="id"
          value={clipboard ? clipboard._id : undefined}
        />

        <div className="space-y-2">
          <Label
            htmlFor="text"
            className="text-sm font-medium text-muted-foreground"
          >
            Content
          </Label>
          <Textarea
            id="text"
            placeholder="Paste or type content to share across devices..."
            className="min-h-[120px] bg-background/50 border-border/50 resize-none"
            disabled={isSubmitting}
            ref={textAreaRef}
            name="text"
            defaultValue={clipboard ? clipboard.text : ""}
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
            disabled={isSubmitting}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
          >
            {isSubmitting ? "Adding..." : "Add to Shared Clipboard"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
