"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import { mailto, projectTypes, site } from "@/lib/site";
import { ACCEPT_ATTR, MAX_FILES, MAX_FILE_BYTES, UPLOAD_PREFIX, formatBytes } from "@/lib/uploads";
import { CheckCircleIcon, CloseIcon } from "./Icons";

type Status =
  | { kind: "idle" }
  | { kind: "sending"; detail: string }
  | { kind: "sent" }
  | { kind: "error"; message: string };

export default function QuoteForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fileError, setFileError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const tooBig = incoming.filter((f) => f.size > MAX_FILE_BYTES);
    const ok = incoming.filter((f) => f.size <= MAX_FILE_BYTES);
    const next = [...files, ...ok].slice(0, MAX_FILES);
    setFiles(next);
    setFileError(
      tooBig.length
        ? `${tooBig.map((f) => f.name).join(", ")} ${tooBig.length > 1 ? "are" : "is"} over ${formatBytes(MAX_FILE_BYTES)}. Please email large files to ${site.email}.`
        : files.length + ok.length > MAX_FILES
          ? `You can attach up to ${MAX_FILES} files.`
          : "",
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    delete data.plans;

    try {
      const folder = `${UPLOAD_PREFIX}${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 8)}/`;
      const uploaded = [];
      for (const [i, file] of files.entries()) {
        setStatus({ kind: "sending", detail: `Uploading ${file.name} (${i + 1} of ${files.length})…` });
        const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
        const blob = await upload(folder + safeName, file, {
          access: "private",
          handleUploadUrl: "/api/plans/upload",
          multipart: file.size > 10 * 1024 * 1024,
        });
        uploaded.push({ pathname: blob.pathname, name: file.name, size: file.size });
      }

      setStatus({ kind: "sending", detail: "Sending your request…" });
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, files: uploaded }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || "Something went wrong.");
      }
      form.reset();
      setFiles([]);
      setStatus({ kind: "sent" });
    } catch (err) {
      console.error("Quote form failed", err);
      setStatus({ kind: "error", message: (err as Error).message });
    }
  };

  if (status.kind === "sent") {
    return (
      <div className="form-success" role="status">
        <CheckCircleIcon className="form-success__icon" />
        <h3>Thanks — your plans are on their way</h3>
        <p>Murray will review them and be in touch to confirm your timeline.</p>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate={false}>
      <div className="field-row">
        <label className="field">
          <span>Name *</span>
          <input name="name" required autoComplete="name" />
        </label>
        <label className="field">
          <span>Email *</span>
          <input name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <div className="field-row">
        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" />
        </label>
        <label className="field">
          <span>Project type</span>
          <select name="projectType" defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            {projectTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="field">
        <span>Project location</span>
        <input name="location" placeholder="Suburb or town" />
      </label>
      <label className="field">
        <span>Tell us about the project</span>
        <textarea name="message" rows={4} placeholder="Scope, stage of design, rough budget, timing…" />
      </label>

      {/* Honeypot: hidden from people, tempting to bots */}
      <label className="hp" aria-hidden="true">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="field">
        <span>Plans and drawings</span>
        <label className="dropzone">
          <input
            ref={inputRef}
            type="file"
            name="plans"
            multiple
            accept={ACCEPT_ATTR}
            onChange={(e) => addFiles(e.target.files)}
          />
          <span>
            <strong>Choose files</strong> or drag them here
          </span>
          <small>
            PDF, images, DWG or ZIP · up to {formatBytes(MAX_FILE_BYTES)} each · max {MAX_FILES} files
          </small>
        </label>
        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <span>{f.name}</span>
                <span className="file-list__size">{formatBytes(f.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => setFiles(files.filter((_, j) => j !== i))}
                  disabled={sending}
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
        {fileError && <p className="form-error">{fileError}</p>}
      </div>

      {status.kind === "error" && (
        <p className="form-error" role="alert">
          Sorry, that didn&apos;t go through. Please try again, or email your plans to{" "}
          <a href={mailto("Plans for a quote")}>{site.email}</a>.
        </p>
      )}

      <button type="submit" className="button button--primary button--large" disabled={sending}>
        {sending ? status.detail : "Send for a quote"}
      </button>
      <p className="form-note">
        Your plans are stored privately and only shared with Murray. Prefer email? Send them to{" "}
        <a href={mailto("Plans for a quote")}>{site.email}</a>.
      </p>
    </form>
  );
}
