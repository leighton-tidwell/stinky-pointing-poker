"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CopySessionCodeField = ({
  code,
  className,
  label = "Share this code",
}: {
  code: string;
  className?: string;
  label?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy session code", error);
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <span className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
        {label}
      </span>
      <div className="flex w-full items-center gap-2 rounded-xl border border-primary/15 bg-secondary/40 p-2">
        <Input
          readOnly
          value={code}
          aria-label="Session share code"
          className="h-11 w-full cursor-text border-none bg-transparent font-semibold uppercase tracking-[0.25em] text-base text-primary focus-visible:ring-0 [font-family:var(--font-mono),monospace]"
          onClick={handleCopy}
        />
        <Button
          type="button"
          aria-label="Copy session code"
          variant="outline"
          onClick={handleCopy}
          className="shrink-0 gap-2 border-primary/30 text-primary"
        >
          {copied ? (
            <>
              <Check className="size-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copy
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
