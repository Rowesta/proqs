import { cacheLife } from "next/cache";

// Cached so the page can still be prerendered; refreshes daily.
export default async function Year() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
