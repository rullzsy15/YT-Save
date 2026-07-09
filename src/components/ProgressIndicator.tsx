import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Download, CheckCircle2, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  message: string;
  downloadUrl?: string;
  errorMessage?: string;
  onDownload?: () => void;
  onReset?: () => void;
}

export function ProgressIndicator({
  status,
  progress,
  message,
  downloadUrl,
  errorMessage,
  onDownload,
  onReset,
}: ProgressIndicatorProps) {
  /* ── Completed state ── */
  if (status === "completed") {
    return (
      <div
        className={cn(
          "animate-fade-in rounded-lg border p-6 text-center",
          "border-[hsl(var(--success)/0.3)] bg-[hsl(var(--success-light))]"
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--success)/0.15)] mb-4">
          <CheckCircle2 className="h-7 w-7 text-[hsl(var(--success))]" />
        </div>
        <h3 className="text-base font-semibold text-[hsl(var(--text-primary))] mb-1">
          Download Complete
        </h3>
        <p className="text-sm text-[hsl(var(--text-secondary))] mb-5">
          Your file has been saved to your device.
        </p>
        {onReset && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-[hsl(var(--text-secondary))] hover:text-[hsl(var(--text-primary))]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Download Another
          </Button>
        )}
      </div>
    );
  }

  /* ── Error state ── */
  if (status === "error") {
    return (
      <div
        className={cn(
          "animate-fade-in rounded-lg border p-6 text-center",
          "border-[hsl(var(--danger)/0.25)] bg-[hsl(var(--danger-light))]"
        )}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--danger)/0.12)] mb-4">
          <AlertCircle className="h-7 w-7 text-[hsl(var(--danger))]" />
        </div>
        <h3 className="text-base font-semibold text-[hsl(var(--text-primary))] mb-1">
          Download Failed
        </h3>
        {errorMessage && (
          <p className="text-sm text-[hsl(var(--text-secondary))] mb-5 max-w-sm mx-auto">
            {errorMessage}
          </p>
        )}
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  /* ── Processing state ── */
  return (
    <div
      className={cn(
        "animate-fade-in rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-6"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-md bg-[hsl(var(--primary-light))]">
          <Loader2 className="h-4 w-4 text-[hsl(var(--primary))] animate-spin" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[hsl(var(--text-primary))] truncate">
            {message || "Processing..."}
          </p>
          <p className="text-xs text-[hsl(var(--text-tertiary))] mt-0.5">
            Please keep this page open
          </p>
        </div>
        <span className="flex-shrink-0 text-sm font-semibold text-[hsl(var(--primary))] tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-1.5" />

      {/* Steps indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex gap-1.5">
          {["Fetching", "Processing", "Saving"].map((step, i) => {
            const stepProgress = (i + 1) * 33;
            const isDone = progress >= stepProgress;
            const isCurrent = progress >= (i * 33) && progress < stepProgress;
            return (
              <div
                key={step}
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full font-medium transition-all duration-[200ms]",
                  isDone
                    ? "bg-[hsl(var(--success-light))] text-[hsl(var(--success))]"
                    : isCurrent
                    ? "bg-[hsl(var(--primary-light))] text-[hsl(var(--primary))]"
                    : "bg-[hsl(var(--surface-2))] text-[hsl(var(--text-tertiary))]"
                )}
              >
                {step}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
