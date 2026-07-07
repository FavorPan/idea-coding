// OpenNext for Cloudflare config.
// See https://opennext.js.org/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

export default defineCloudflareConfig({
  // Cache Components (ISR / 'use cache') needs a durable incremental cache.
  // R2 is the recommended backing store. Create the bucket before deploying:
  //   wrangler r2 bucket create idea-coding-opennext-cache
  incrementalCache: r2IncrementalCache,
});
