// DEPRECATED — unused, and stale relative to the backend's DEPARTMENTS
// ENUM (src/constants/taxonomy.ts on Miva-Hubble-Backend). This static
// VAULT_DEPARTMENTS list (Computer Science, Mathematics, Physics, Chemistry,
// Biology, Engineering) does not match the backend's 8-item enum, so any
// value picked from it would fail Zod validation on submit.
//
// Vault.tsx and UploadResourceModal.tsx both source department options live
// from GET /taxonomy via the useTaxonomy() hook, which is always in sync
// with the backend enum. Nothing in this codebase imports this file — safe
// to delete.
