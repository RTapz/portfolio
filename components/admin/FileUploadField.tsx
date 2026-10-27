"use client";

import Image from "next/image";
import { useState } from "react";

interface FileUploadFieldProps {
  label: string;
  kind: "portrait" | "thumbnail" | "cv";
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function FileUploadField({
  label,
  kind,
  value,
  onChange,
  hint,
}: FileUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showPath, setShowPath] = useState(false);

  async function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("kind", kind);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed");
        return;
      }
      onChange(data.url);
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const isImage = kind !== "cv";
  const previewClass =
    kind === "portrait" ? "h-36 w-28" : "aspect-video w-full max-w-sm";

  return (
    <div className="space-y-3 rounded-xl border border-white/10 bg-black/40 p-4">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-zinc-500">{hint}</p>}
      </div>

      {value && isImage && (
        <div
          className={`relative overflow-hidden rounded-lg border border-white/10 bg-zinc-900 ${previewClass}`}
        >
          <Image src={value} alt="Preview" fill className="object-cover" />
        </div>
      )}

      {value && !isImage && (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
        >
          Open current PDF ↗
        </a>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex cursor-pointer rounded-full px-5 py-2 text-sm font-medium ${
            uploading
              ? "bg-white/10 text-zinc-500"
              : "bg-brand text-white hover:bg-brand/90"
          }`}
        >
          {uploading ? "Uploading…" : value ? "Replace file" : "Upload file"}
          <input
            type="file"
            className="hidden"
            accept={
              kind === "cv"
                ? ".pdf,application/pdf"
                : "image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            }
            onChange={onFileSelect}
            disabled={uploading}
          />
        </label>
        <button
          type="button"
          onClick={() => setShowPath((v) => !v)}
          className="text-xs text-zinc-500 hover:text-zinc-300"
        >
          {showPath ? "Hide path" : "Paste URL instead"}
        </button>
      </div>

      {showPath && (
        <input
          className="field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/... or https://..."
        />
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
