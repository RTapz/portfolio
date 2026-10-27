interface AdminFieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminField({
  label,
  hint,
  children,
  className = "",
}: AdminFieldProps) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-sm font-medium text-zinc-200">{label}</span>
      {hint && <p className="text-xs leading-relaxed text-zinc-500">{hint}</p>}
      {children}
    </label>
  );
}
