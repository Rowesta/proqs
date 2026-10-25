"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState } from "react";
import { mailto, projectTypes, site, steps } from "@/lib/site";
import { ACCEPT_ATTR, MAX_FILES, MAX_FILE_BYTES, UPLOAD_PREFIX, formatBytes } from "@/lib/uploads";
import { CheckCircleIcon, CloseIcon } from "./Icons";

type Sent = { name: string; email: string; files: { name: string; size: number }[] };

type Status =
  | { kind: "idle" }
  | { kind: "uploading"; percent: number; fileIndex: number; fileCount: number }
  | { kind: "submitting" }
  | { kind: "sent"; sent: Sent }
  | { kind: "error" };

export default function QuoteForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [fileError, setFileError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  const busy = status.kind === "uploading" || status.kind === "submitting";

  // Don't let someone close the tab halfway through an upload without a warning.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  // Bring the outcome into view: the success panel replaces a long form, so the page jumps.
  useEffect(() => {
    const target = status.kind === "sent" ? successRef.current : status.kind === "error" ? errorRef.current : null;
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.focus({ preventScroll: true });
  }, [status.kind]);

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
      const totalBytes = files.reduce((sum, f) => sum + f.size, 0) || 1;
      let doneBytes = 0;
      const uploaded = [];
      for (const [i, file] of files.entries()) {
        setStatus({ kind: "uploading", percent: Math.round((doneBytes / totalBytes) * 100), fileIndex: i, fileCount: files.length });
        const safeName = file.name.replace(/[^\w.\- ]+/g, "_");
        const blob = await upload(folder + safeName, file, {
          access: "private",
          handleUploadUrl: "/api/plans/upload",
          multipart: file.size > 10 * 1024 * 1024,
          onUploadProgress: ({ loaded }) =>
            setStatus({
              kind: "uploading",
              percent: Math.min(99, Math.round(((doneBytes + loaded) / totalBytes) * 100)),
              fileIndex: i,
              fileCount: files.length,
            }),
        });
        doneBytes += file.size;
        uploaded.push({ pathname: blob.pathname, name: file.name, size: file.size });
      }

      setStatus({ kind: "submitting" });
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, files: uploaded }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        throw new Error(error || `Request failed (${res.status})`);
      }
      form.reset();
      setFiles([]);
      setStatus({
        kind: "sent",
        sent: { name: data.name?.trim() ?? "", email: data.email?.trim() ?? "", files: uploaded.map(({ name, size }) => ({ name, size })) },
      });
    } catch (err) {
      console.error("Quote form failed", err);
      setStatus({ kind: "error" });
    }
  };

  if (status.kind === "sent") {
    const { name, email, files: sentFiles } = status.sent;
    const first = name.split(/\s+/)[0];
    return (
      <div className="form-success" role="status" aria-live="polite" ref={successRef} tabIndex={-1}>
        <CheckCircleIcon className="form-success__icon" />
        <h3 className="form-success__title">Thanks{first ? `, ${first}` : ""} — your request has been sent</h3>
        <p className="form-success__lead">
          Murray has received your details and will reply to <strong>{email}</strong>.
        </p>

        <div className="form-success__summary">
          <p className="form-success__label">What we received</p>
          {sentFiles.length ? (
            <ul className="file-list file-list--sent">
              {sentFiles.map((f, i) => (
                <li key={`${f.name}-${i}`}>
                  <CheckCircleIcon className="file-list__ok" />
                  <span>{f.name}</span>
                  <span className="file-list__size">{formatBytes(f.size)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="form-success__muted">Your project details (no plans attached — you can email them any time).</p>
          )}
        </div>

        <div className="form-success__summary">
          <p className="form-success__label">What happens next</p>
          <ol className="form-success__steps">
            <li>Murray reviews your plans and confirms your timeline.</li>
            <li>{steps[1].body}</li>
            <li>{steps[2].body}</li>
          </ol>
        </div>

        <p className="form-success__muted">
          Need to add something? Email <a href={mailto("More info for my quote request")}>{site.email}</a> or call{" "}
          <a href={site.phoneHref}>{site.phoneDisplay}</a>.
        </p>
        <button type="button" className="button button--outline" onClick={() => setStatus({ kind: "idle" })}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form className="quote-form" onSubmit={onSubmit} aria-busy={busy}>
      <fieldset className="quote-form__fields" disabled={busy}>
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
                  <button type="button" aria-label={`Remove ${f.name}`} onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {fileError && <p className="form-error">{fileError}</p>}
        </div>
      </fieldset>

      {status.kind === "error" && (
        <p className="form-error form-error--box" role="alert" ref={errorRef} tabIndex={-1}>
          <strong>Sorry, your request didn&apos;t send.</strong> Nothing was lost — please try again, or email your plans
          to <a href={mailto("Plans for a quote")}>{site.email}</a>.
        </p>
      )}

      {busy ? (
        <div className="form-progress" role="status" aria-live="polite">
          <div className="form-progress__text">
            <span className="spinner" aria-hidden="true" />
            {status.kind === "uploading"
              ? `Uploading plans${status.fileCount > 1 ? ` (${status.fileIndex + 1} of ${status.fileCount})` : ""}… ${status.percent}%`
              : "Sending your request to Murray…"}
          </div>
          <div className="form-progress__bar" aria-hidden="true">
            <span style={{ width: `${status.kind === "uploading" ? status.percent : 100}%` }} />
          </div>
          <p className="form-note">Please keep this page open until it&apos;s finished.</p>
        </div>
      ) : (
        <button type="submit" className="button button--primary button--large">
          {status.kind === "error" ? "Try again" : "Send for a quote"}
        </button>
      )}
      <p className="form-note">
        Your plans are stored privately and only shared with Murray. Prefer email? Send them to{" "}
        <a href={mailto("Plans for a quote")}>{site.email}</a>.
      </p>
    </form>
  );
}
