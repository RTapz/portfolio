export type ToastTone = "success" | "error" | "info";

interface AdminToastProps {
  message: string;
  tone: ToastTone;
  onDismiss?: () => void;
}

const styles: Record<ToastTone, string> = {
  success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  error: "border-red-500/40 bg-red-500/10 text-red-300",
  info: "border-brand/40 bg-brand/10 text-zinc-200",
};

export function AdminToast({ message, tone, onDismiss }: AdminToastProps) {
  if (!message) return null;
  return (
    <div
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${styles[tone]}`}
      role="status"
    >
      <span>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 text-xs opacity-70 hover:opacity-100"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}
