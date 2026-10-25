// Shared limits for plan uploads, used by the form and both API routes.

export const MAX_FILES = 10;
export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file
export const UPLOAD_PREFIX = "plans/";

export const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/webp",
  "application/zip",
  "application/x-zip-compressed",
  "application/acad",
  "image/vnd.dwg",
  "application/octet-stream", // .dwg and other CAD files often arrive untyped
];

export const ACCEPT_ATTR = ".pdf,.jpg,.jpeg,.png,.heic,.webp,.zip,.dwg,.dxf";

export const formatBytes = (n: number) =>
  n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1).replace(/\.0$/, "")} MB`;
