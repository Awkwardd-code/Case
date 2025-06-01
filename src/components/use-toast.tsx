// hooks/use-toast.tsx
import { toast as sonnerToast } from "sonner";
import React from "react";

type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "destructive";

interface ToastProps {
  title: string;
  description?: string;
  data?: Record<string, string | number | boolean>;
  variant?: ToastVariant;
}

export function toast({ title, description, data = {}, variant = "default" }: ToastProps) {
  const content = (
    <div className="text-sm space-y-2">
      <div>
        <p className="text-base font-semibold text-foreground">{title}</p>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      {Object.keys(data).length > 0 && (
        <div className="bg-muted/50 border border-border rounded-md p-2">
          <p className="text-xs font-medium text-muted-foreground mb-1">Details:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {Object.entries(data).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold text-foreground">{key}:</span>{" "}
                <span className="text-muted-foreground">{String(value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const variantMap: Record<ToastVariant, (message: React.ReactNode) => void> = {
    default: sonnerToast,
    success: sonnerToast.success,
    error: sonnerToast.error,
    warning: sonnerToast.warning,
    info: sonnerToast.info,
    destructive: sonnerToast.error, // alias for error
  };

  variantMap[variant](content);
}
