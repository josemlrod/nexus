import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "../../convex/_generated/api";

export function ActivityForm() {
  const addActivity = useMutation(api.activities.addActivity);

  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    document.addEventListener(
      "keyup",
      (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const date = formData.get("date") as string;
    const text = formData.get("text") as string;

    if (!text.trim()) return;

    try {
      setIsSubmitting(true);
      await addActivity({ date: new Date(date).getTime(), text });
      return { ok: true };
    } catch (err) {
      console.error(err);
      return { ok: false };
    } finally {
      if (formRef.current) formRef.current.reset();
      setIsSubmitting(false);
    }
  };

  const defaultDate = format(new Date().getTime(), "yyyy-MM-dd");

  return open ? (
    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="space-y-4" ref={formRef}>
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
            name="date"
            type="date"
            className="bg-background/50 border-border/50"
            defaultValue={defaultDate}
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="text"
            className="text-sm font-medium text-muted-foreground"
          >
            What did you do? (Markdown supported)
          </Label>
          <Textarea
            id="text"
            name="text"
            placeholder="Describe your activity... You can use **bold**, *italic*, and [links](https://example.com)"
            className="min-h-[120px] bg-background/50 border-border/50 resize-none"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
          >
            {isSubmitting ? "Adding..." : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  ) : (
    <div className="w-full flex justify-end">
      <Button variant="default" onClick={() => setOpen(true)}>
        <Plus className="h-5 w-5 text-primary-foreground" />
        Add Activity
      </Button>
    </div>
  );
}
