/**
 * async.ts
 *
 * Shared vocabulary for any component/page that performs an async action
 * (save, submit, upload, fetch) and needs to reflect that action's state in
 * the UI. Using one shared type keeps every feature's loading/error/success
 * handling consistent instead of each feature inventing its own booleans.
 */

export type AsyncStatus = "idle" | "loading" | "success" | "error";
